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
    const result = prismaClient.$transaction(async (tx) => {
      const { email, bookId, preferredCurrency = "NGN" } = payload;
      const FINE_PAY_DAY = 1; // $ 1
      const borrowedBookExist = await tx.borrowedBook.findFirst({
        where: { bookId, borrowedBy: userId },
      });

      if (!borrowedBookExist) {
        throw new ResourceNotFound("No record of borrowed book!");
      }
      if (!borrowedBookExist.returnedAt) {
        const currentDate = new Date();
        const isOverDue = currentDate > borrowedBookExist.dueDate;
        if (isOverDue) {
          const daysLate = Math.ceil(
            (currentDate.getTime() - borrowedBookExist.dueDate.getTime()) /
              (24 * 60 * 60 * 1000)
          );
          const fineAmountInUSD = daysLate * FINE_PAY_DAY;
          const amountInPreferredCurrency = await this.getExchangeRate(
            "USD",
            preferredCurrency,
            fineAmountInUSD
          );
          const params = JSON.stringify({
            email,
            amountInPreferredCurrency,
            currency: preferredCurrency,
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

              res.on("data", (chunk) => {
                data += chunk;
              });

              res.on("end", () => {
                const statusCode = res.statusCode || 500;

                if (statusCode >= 400) {
                  reject(
                    new BadRequest(
                      `Paystack API responded with status code ${statusCode}`
                    )
                  );
                }

                try {
                  const parsedData = JSON.parse(data);
                  resolve(parsedData);
                } catch (err) {
                  reject(new Error("Failed to parse response from Paystack"));
                }
              });
            });

            reqPaystack.on("error", (error) => {
              reject(error);
            });

            reqPaystack.write(params);
            reqPaystack.end();
          });
        }
      }
    });
  }

  private async getExchangeRate(
    fromCurrency: string,
    toCurrency: string,
    amount: number
  ): Promise<number> {
    const API_KEY = config.EXCHANGE_RATE_API_KEY;
    const apiUrl = `https://api.exchangeratesapi.io/v1/convert?access_key=${API_KEY}&from=${fromCurrency}&to=${toCurrency}&amount=${amount}`;

    try {
      const response = await axios.get(apiUrl);
      const rates = response.data;
      console.log(rates);
      if (!rates || !rates[toCurrency]) {
        throw new Error(
          `Exchange rate for ${fromCurrency} to ${toCurrency} not found.`
        );
      }
      return rates[toCurrency];
    } catch (err) {
      throw new Error("Failed to fetch exchange rate. Please try again later.");
    }
  }

  public async verifyPayment(payload: { reference: string }): Promise<any> {
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

            resolve(parsedData.data);
          } catch (err) {
            reject(new Error("Failed to parse response from Paystack"));
          }
        });
      });

      reqPaystack.on("error", (error) => {
        reject(error);
      });

      reqPaystack.end(); // Ensure the request is completed
    });
  }
}
