import React, { useEffect, useState } from "react";
import { sendGetRequest } from "../lib/http";

function OrderStats() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const result = await sendGetRequest('/orders/stats');
      setStats(result as Record<string, number>);
    };

    fetchStats();
  }, []);

  return (
    <div>
      {stats ? (
        <ul>
          {Object.entries(stats).map(([month, total]) => (
            <li key={month}>{month}: {total}€</li>
          ))}
        </ul>
      ) : (
        "Chargement des statistiques..."
      )}
    </div>
  );
}

export default OrderStats;