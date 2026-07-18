package com.nimblewallet.wallet.activity;

import java.util.List;

/** 30-day inflow/outflow analytics. Amounts in minor units (paise). */
public record AnalyticsView(
        List<DailyTotal> dailyTotals,
        long totalInMinor,
        long totalOutMinor,
        long netMinor) {

    public record DailyTotal(String date, long inflowMinor, long outflowMinor) {
    }
}
