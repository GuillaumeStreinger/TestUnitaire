export async function sendGetRequest(url: string): Promise<Record<string, unknown>> {
    try {
        const response = await fetch(url, {
            method: 'GET', // Méthode HTTP
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); // Parse la réponse en JSON
        return data as Record<string, unknown>;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Rejette l'erreur pour la gestion d'erreur en amont
    }
}
