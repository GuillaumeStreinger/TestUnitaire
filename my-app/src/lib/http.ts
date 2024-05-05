export async function sendGetRequest(
  url: string
): Promise<Record<string, unknown>> {
  try {
    const response = await fetch(url, {
      method: 'GET', // Méthode HTTP
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json(); // Parse la réponse en JSON
    return data as Record<string, unknown>;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Rejette l'erreur pour la gestion d'erreur en amont
  }
}

export async function sendPutRequest(
  url: string,
  data: any
): Promise<Record<string, unknown>> {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData as Record<string, unknown>;
  } catch (error) {
    console.error('Error sending PUT request:', error);
    throw error;
  }
}
