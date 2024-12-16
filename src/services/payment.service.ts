import https from "https";
import config from "../config";
import { BadRequest, Conflict, ResourceNotFound } from "../middlewares";
import axios from "axios";
import { prismaClient } from "..";
export class PaymentService {
  public async payFine(
    payload: {
      email: string;
      bookId: string;
      preferredCurrency?: string;
    },
    userId: string
  ): Promise<any> {
    const FINE_PAY_DAY = 1; // $1 fine per day
    const { email, bookId, preferredCurrency = "NGN" } = payload;

    const borrowedBookExist = await prismaClient.borrowedBook.findFirst({
      where: { bookId, borrowedBy: userId },
    });

    if (!borrowedBookExist) {
      throw new ResourceNotFound("No record of borrowed book!");
    }

    if (!borrowedBookExist.returnedAt) {
      const currentDate = new Date();
      const isOverdue = currentDate > borrowedBookExist.dueDate;

      if (isOverdue) {
        const daysLate = Math.ceil(
          (currentDate.getTime() - borrowedBookExist.dueDate.getTime()) /
            (24 * 60 * 60 * 1000)
        );

        const rateInPreferredCurrency = await this.getExchangeRate(
          "USD",
          preferredCurrency
        );

        // Calculate fine in the preferred currency
        const fineAmountInPreferredCurrency =
          daysLate * FINE_PAY_DAY * rateInPreferredCurrency;

        //  Convert amount to smallest currency unit
        const smallestUnitAmount = Math.round(
          fineAmountInPreferredCurrency * 100
        ); // Paystack requires smallest unit (e.g., kobo, pesewas)

        const params = JSON.stringify({
          email,
          amount: smallestUnitAmount,
          currency: preferredCurrency, // Currency (e.g., NGN, GHS, USD)
          metadata: {
            bookId: bookId,
            userId: userId,
          },
        });

        const options = {
          hostname: "api.paystack.co",
          port: 443,
          path: "/transaction/initialize",
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        };

        return new Promise((resolve, reject) => {
          const reqPaystack = https.request(options, (res) => {
            let data = "";

            // Collect response chunks
            res.on("data", (chunk) => {
              data += chunk;
            });

            // Handle response completion
            res.on("end", () => {
              try {
                const parsedData = JSON.parse(data);

                // Handle errors from Paystack response
                if (res.statusCode >= 400) {
                  reject(
                    new BadRequest(
                      `Paystack API error: ${
                        parsedData.message || "Unknown error"
                      }`
                    )
                  );
                } else {
                  // Successfully resolve with parsed Paystack response
                  resolve(parsedData);
                }
              } catch (err) {
                reject(new Error("Failed to parse response from Paystack"));
              }
            });
          });

          reqPaystack.on("error", (error) => {
            reject(new Error(`Paystack request failed: ${error.message}`));
          });

          // Write the request payload and end the request
          reqPaystack.write(params);
          reqPaystack.end();
        });
      }
    }

    return {
      message: "No fine required; book has been returned on time.",
    };
  }

  private async getExchangeRate(
    fromCurrency: string,
    toCurrency: string
  ): Promise<number> {
    const API_KEY = config.EXCHANGE_RATE_API_KEY;
    const apiUrl = `https://v6.exchangerate-api.com/v6/b0dfe00cf0018c8fefa043e3/latest/USD`;

    try {
      const response = await axios.get(apiUrl);
      const rates = response.data.conversion_rates;
      if (!rates || !rates[toCurrency]) {
        throw new Error(
          `Exchange rate for ${fromCurrency} to ${toCurrency} not found.`
        );
      }
      return rates[toCurrency];
    } catch (err) {
      throw new Error(
        `Failed to fetch exchange rate. Please try again later. ${err} `
      );
    }
  }

  public async processPaymentVerification(payload: {
    reference: string;
  }): Promise<any> {
    const transactionData = await this.verifyPayment(payload);

    const result = await this.updateModelsAfterPayment(transactionData);

    return result;
  }

  private async verifyPayment(payload: { reference: string }): Promise<any> {
    const { reference } = payload;

    if (!reference) {
      throw new BadRequest("Reference is required for payment verification.");
    }

    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: `/transaction/verify/${reference}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.PAYSTACK_SECRET_KEY}`,
      },
    };

    return new Promise((resolve, reject) => {
      const reqPaystack = https.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          const statusCode = res.statusCode || 500;

          if (statusCode >= 400) {
            return reject(
              new BadRequest(
                `Paystack API responded with status code ${statusCode}`
              )
            );
          }

          try {
            const parsedData = JSON.parse(data);

            if (parsedData.status !== true) {
              return reject(
                new BadRequest(
                  `Payment verification failed: ${
                    parsedData.message || "Unknown error"
                  }`
                )
              );
            }
            // Ensure metadata contains required info (bookId, userId)
            const transactionData = parsedData.data;
            if (
              !transactionData.metadata?.bookId ||
              !transactionData.metadata?.userId
            ) {
              return reject(
                new BadRequest(
                  "Invalid metadata: bookId and userId are required."
                )
              );
            }

            resolve(transactionData); // Resolve with the full transaction data
          } catch (err) {
            reject(
              new Error("Failed to parse Paystack verification response.")
            );
          }
        });
      });

      reqPaystack.on("error", (error) => {
        reject(error);
      });

      reqPaystack.end(); // Complete the request
    });
  }

  private async updateModelsAfterPayment(transactionData: any): Promise<any> {
    const { metadata, amount, currency } = transactionData;
    const { bookId, userId } = metadata;
    const borrowedBookExist = await prismaClient.borrowedBook.findFirst({
      where: { bookId },
    });
    const borrowedBook = await prismaClient.borrowedBook.update({
      where: { id: borrowedBookExist.id },
      data: {
        isFinePaid: true,
      },
    });

    if (!borrowedBook) {
      throw new ResourceNotFound(
        "No borrowed book found with the provided bookId."
      );
    }

    const fine = await prismaClient.fine.create({
      data: {
        userId,
        bookId,
        amount: amount / 100, // Convert back from smallest unit
        currency,
      },
    });

    return {
      message: "Payment verified and records updated successfully.",
      borrowedBook,
      fine,
    };
  }
}
