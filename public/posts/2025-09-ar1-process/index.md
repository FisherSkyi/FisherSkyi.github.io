---
title: AR(1) process and its properties
date: "2025-09"
tags: [statistics, time-series]
summary: A brief note on the AR(1) process and its key properties.
---

The **autoregressive order-1** (AR(1)) process is the simplest linear
time-series model. It defines each observation as a linear function of the
previous one plus noise:

$$X_t = c + \phi X_{t-1} + \varepsilon_t, \qquad \varepsilon_t \sim \mathcal{N}(0, \sigma^2)$$

Key properties:

- **Stationarity** requires $|\phi| < 1$.
- The autocorrelation decays geometrically: $\rho_k = \phi^k$.
- It can be written as an infinite moving average, so shocks fade over time.

The full worked problem sheet is [available as a PDF](TSA4__Problem_3_2-1.pdf).
