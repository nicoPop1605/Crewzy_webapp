export async function analyzeBehaviorWithAI(userId, actionsLog) {
    try {
        const response = await fetch('http://127.0.0.1:11434/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'phi3',
                messages: [
                    {
                        role: "system",
                        content: "You are a strict cybersecurity AI. Analyze the log. If the timestamps are only milliseconds apart, respond EXACTLY with: 'BOT. Actions are too fast for a human.' If it looks normal, respond EXACTLY with: 'HUMAN. Normal timing.' DO NOT write anything else. DO NOT use other languages."
                    },
                    {
                        role: "user",
                        content: `User Log: ${JSON.stringify(actionsLog)}`
                    }
                ],
                stream: false,
                options: { temperature: 0.0 }
            })
        });

        // 1. Verificăm dacă Ollama s-a plâns de ceva (ex: 404 Model Not Found)
        if (!response.ok) {
            const textError = await response.text();
            console.error("🔴 Ollama a răspuns cu o eroare:", textError);
            return "UNKNOWN. Eroare internă Ollama.";
        }

        const data = await response.json();

        // 2. Returnăm mesajul
        return data.message.content.trim();

    } catch (error) {
        // 3. Aici printăm ADEVĂRATA eroare de rețea sau de cod
        console.error("🔴 Eroare CRITICĂ în execuție:", error.message);
        return "UNKNOWN. AI Offline.";
    }
}