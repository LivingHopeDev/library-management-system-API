import https from "https";
import config from "../config";
import { BadRequest } from "../middlewares";
export class PaymentService {
  public async payFine(payload: {
    email: string;
    amount: string;
  }): Promise<any> {
    const { email, amount } = payload;

    if (!email || !amount) {
      throw new BadRequest("Email and amount are required for payment.");
    }

    const params = JSON.stringify({ email, amount });

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
