package com.crewzy.app // Pachetul tău corect

import android.util.Log
import io.socket.client.IO
import io.socket.client.Socket
import org.json.JSONArray
import org.json.JSONObject

// 1. Modelul simplu de date pe care îl primim de la rețea
data class ChatMessage(
    val userId: String,
    val userName: String,
    val text: String,
    val timestamp: String? = null
)

// 2. Managerul care gestionează conexiunea WebSocket
class ChatSocketManager(
    private val onMessageReceived: (ChatMessage) -> Unit,
    private val onHistoryReceived: (List<ChatMessage>) -> Unit
) {
    private lateinit var socket: Socket

    init {
        try {
            // ATENȚIE: 10.0.2.2 este adresa prin care emulatorul Android vede "localhost-ul" laptopului tău
            socket = IO.socket("http://10.0.2.2:4000") 
            
            setupListeners()
            socket.connect()
        } catch (e: Exception) {
            Log.e("ChatSocket", "Eroare la conectare: ${e.message}")
        }
    }

    private fun setupListeners() {
        // Când ne conectăm cu succes la serverul tău Node.js
        socket.on(Socket.EVENT_CONNECT) {
            Log.d("ChatSocket", "✅ Conectat cu succes la WebSockets!")
        }

        // Când primim istoricul de mesaje (la prima intrare în aplicație)
        socket.on("chat_history") { args ->
            if (args.isNotEmpty()) {
                val data = args[0] as JSONArray
                val history = mutableListOf<ChatMessage>()
                
                for (i in 0 until data.length()) {
                    val msgObj = data.getJSONObject(i)
                    history.add(
                        ChatMessage(
                            userId = msgObj.getString("userId"),
                            userName = msgObj.getString("userName"),
                            text = msgObj.getString("text"),
                            timestamp = msgObj.optString("timestamp")
                        )
                    )
                }
                onHistoryReceived(history) // Trimitem lista către Activity
            }
        }

        // Când primim un singur mesaj nou (în timp real)
        socket.on("receive_message") { args ->
            if (args.isNotEmpty()) {
                val msgObj = args[0] as JSONObject
                val noulMesaj = ChatMessage(
                    userId = msgObj.getString("userId"),
                    userName = msgObj.getString("userName"),
                    text = msgObj.getString("text"),
                    timestamp = msgObj.optString("timestamp")
                )
                onMessageReceived(noulMesaj) // Trimitem mesajul nou către Activity
            }
        }
    }

    // Funcția pe care o apelăm când dăm click pe butonul "Send" pe Android
    fun sendMessage(text: String) {
        val messageData = JSONObject()
        messageData.put("userId", "android_user") // ID-ul tău simulat de pe Android
        messageData.put("userName", "📱 Android User") // Numele care se va vedea pe interfața Web!
        messageData.put("text", text)

        socket.emit("send_message", messageData)
    }

    // Oprim conexiunea când închidem aplicația ca să nu consumăm bateria telefonului
    fun disconnect() {
        socket.disconnect()
        socket.off()
    }
}