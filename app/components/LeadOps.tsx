"use client";
import React, { useState } from "react";

export default function LeadOps() {
  const [show, setShow] = useState(false);

  return (
    <div style={{ paddingTop: 12 }}>
      <button onClick={() => setShow(true)}>Get Junk Car Estimate</button>

      {show && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              textAlign: "center",
              width: 320
            }}
          >
            <h3>Junk Car Estimate</h3>
            <p>
              The average range for a junk car is <strong>$175 – $300</strong>.
            </p>
            <p>Is that what you were expecting?</p>

            <div style={{ marginTop: 16 }}>
              <button
                onClick={() => {
                  alert("You clicked Yes");
                  setShow(false);
                }}
                style={{ marginRight: 10 }}
              >
                Yes
              </button>
              <button
                onClick={() => {
                  alert("You clicked No");
                  setShow(false);
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
