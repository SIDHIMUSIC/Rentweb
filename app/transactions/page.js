"use client";
import { useEffect, useState } from "react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      localStorage.setItem("redirect", "/transactions");
      window.location.href = "/login";
    } else {
      setToken(t);
    }
  }, []);

  useEffect(() => {
    if (token) loadTransactions(token);
  }, [token]);

  const loadTransactions = async (tkn) => {
    try {
      const res = await fetch("/api/transactions", {
        headers: { Authorization: tkn },
      });

      const data = await res.json();

      if (data.success) {
        setTransactions(data.data);
      }

      setLoading(false);
    } catch (err) {
      console.log("LOAD ERROR:", err);
      setLoading(false);
    }
  };

  const printReceipt = (tx) => {
    const html = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .receipt { border: 3px solid #000; padding: 30px; max-width: 400px; margin: auto; }
          .header { text-align: center; margin-bottom: 20px; }
          .header h1 { color: #3b82f6; margin: 0; }
          .divider { border-top: 2px solid #000; margin: 15px 0; }
          .row { display: flex; justify-content: space-between; margin: 10px 0; }
          .label { font-weight: bold; }
          .success { color: green; font-weight: bold; font-size: 18px; text-align: center; }
          .footer { text-align: right; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h1>HARRY RENT HOUSE</h1>
            <p>Bihar Sharif, 803216</p>
            <p>Payment Receipt</p>
          </div>

          <div class="divider"></div>

          <div class="row">
            <span class="label">Tenant:</span>
            <span>${tx.tenant_name}</span>
          </div>

          <div class="row">
            <span class="label">Room:</span>
            <span>${tx.room_number}</span>
          </div>

          <div class="row">
            <span class="label">Amount Paid:</span>
            <span>Rs ${tx.amount}</span>
          </div>

          <div class="row">
            <span class="label">Payment Mode:</span>
            <span>${tx.payment_mode}</span>
          </div>

          <div class="row">
            <span class="label">Transaction ID:</span>
            <span>${tx.transaction_id}</span>
          </div>

          <div class="row">
            <span class="label">Date:</span>
            <span>${new Date(tx.created_at).toLocaleString()}</span>
          </div>

          <div class="divider"></div>

          <div class="success">PAYMENT SUCCESSFUL</div>

          <div class="divider"></div>

          <div class="footer">
            <p>Authorized Signature</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const win = window.open("", "", "width=500,height=700");
    win.document.write(html);
    win.document.close();
    win.print();
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">
        Transaction History
      </h1>

      {transactions.length === 0 && (
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-gray-500">No transactions yet</p>
        </div>
      )}

      <div className="grid gap-4">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className={`p-6 rounded-lg shadow-lg ${
              tx.status === "success"
                ? "bg-green-50 border-2 border-green-500"
                : "bg-red-50 border-2 border-red-500"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">
                  {tx.tenant_name} - {tx.room_number}
                </h3>

                <p className="text-2xl font-bold text-green-600 my-2">
                  Rs {tx.amount}
                </p>

                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">Payment Mode:</span>{" "}
                    {tx.payment_mode}
                  </p>

                  <p>
                    <span className="font-semibold">Transaction ID:</span>{" "}
                    {tx.transaction_id}
                  </p>

                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(tx.created_at).toLocaleString()}
                  </p>

                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    <span
                      className={
                        tx.status === "success"
                          ? "text-green-600 font-bold"
                          : "text-red-600 font-bold"
                      }
                    >
                      {tx.status.toUpperCase()}
                    </span>
                  </p>
                </div>
              </div>

              {tx.status === "success" && (
                <button
                  onClick={() => printReceipt(tx)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ml-4"
                >
                  Print Receipt
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
