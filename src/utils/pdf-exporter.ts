export async function generateWeeklyReportPDF(): Promise<void> {
  if (typeof window === 'undefined') return;

  const content = `
    <html>
      <head>
        <title>NutraScan Weekly Fitness & Nutrition Report</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 30px; color: #1e293b; }
          h1 { color: #0e7a4a; margin-bottom: 5px; }
          .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 20px; }
          .stat-grid { display: flex; gap: 15px; margin-bottom: 25px; }
          .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; flex: 1; text-align: center; }
          .stat-value { font-size: 24px; font-weight: bold; color: #0e7a4a; margin-top: 5px; }
          .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 12px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>NutraScan Weekly Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>

        <h2>Weekly Summary Overview</h2>
        <div class="stat-grid">
          <div class="stat-card">
            <div>Avg Daily Calories</div>
            <div class="stat-value">1,940 kcal</div>
          </div>
          <div class="stat-card">
            <div>Avg Daily Protein</div>
            <div class="stat-value">128g</div>
          </div>
          <div class="stat-card">
            <div>Avg Hydration</div>
            <div class="stat-value">2,500 ml</div>
          </div>
        </div>

        <h2>Key Insights</h2>
        <ul>
          <li><strong>Protein Goal:</strong> Achieved on 6 out of 7 days this week. Excellent consistency!</li>
          <li><strong>Weight Trend:</strong> Steady progress towards target goal.</li>
          <li><strong>Hydration:</strong> Hydration target met consistently.</li>
        </ul>

        <div class="footer">
          Generated automatically by MyFitness (NutraScan AI Engine)
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  }
}
