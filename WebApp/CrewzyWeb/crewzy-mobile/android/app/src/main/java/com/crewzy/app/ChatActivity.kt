package com.crewzy.app 

import android.graphics.Color
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class ChatActivity : AppCompatActivity() {

    private lateinit var db: AppDatabase
    private lateinit var chatManager: ChatSocketManager

    private lateinit var chatContainer: LinearLayout
    private lateinit var etMessage: EditText
    private lateinit var btnSend: Button
    private lateinit var scrollViewChat: ScrollView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_chat) // Aici legăm codul de XML-ul creat la Pasul 1!

        // Legăm variabilele de elementele din interfață
        chatContainer = findViewById(R.id.chatContainer)
        etMessage = findViewById(R.id.etMessage)
        btnSend = findViewById(R.id.btnSend)
        scrollViewChat = findViewById(R.id.scrollViewChat)

        // 1. Inițializăm Baza de Date locală
        db = AppDatabase.getDatabase(this)

        // 2. Încărcăm mesajele salvate offline din Room DB
        loadOfflineMessages()

        // 3. Ne conectăm la WebSockets
        chatManager = ChatSocketManager(
            onHistoryReceived = { history ->
                lifecycleScope.launch(Dispatchers.IO) {
                    val entities = history.map { 
                        ChatMessageEntity(userId = it.userId, userName = it.userName, text = it.text, timestamp = it.timestamp ?: "") 
                    }
                    db.chatDao().clearAll()
                    db.chatDao().insertAll(entities)
                    loadOfflineMessages()
                }
            },
            onMessageReceived = { newMessage ->
                lifecycleScope.launch(Dispatchers.IO) {
                    val entity = ChatMessageEntity(userId = newMessage.userId, userName = newMessage.userName, text = newMessage.text, timestamp = newMessage.timestamp ?: "")
                    db.chatDao().insertMessage(entity)
                    loadOfflineMessages()
                }
            }
        )

        // 4. Logica butonului de Send
        btnSend.setOnClickListener {
            val text = etMessage.text.toString()
            if (text.isNotEmpty()) {
                chatManager.sendMessage(text) // Trimitem la Node.js
                etMessage.text.clear() // Curățăm câmpul
            }
        }
    }

    private fun loadOfflineMessages() {
        lifecycleScope.launch(Dispatchers.IO) {
            val savedMessages = db.chatDao().getAllMessages()
            
            withContext(Dispatchers.Main) {
                chatContainer.removeAllViews() // Curățăm ecranul
                
                // Adăugăm fiecare mesaj pe ecran
                savedMessages.forEach { msg ->
                    val textView = TextView(this@ChatActivity).apply {
                        text = "${msg.userName}: ${msg.text}"
                        textSize = 16f
                        setPadding(16, 16, 16, 16)
                        // Dacă mesajul e trimis de noi, îl facem albastru
                        if (msg.userId == "android_user") {
                            setBackgroundColor(Color.parseColor("#E3F2FD"))
                        } else {
                            setBackgroundColor(Color.WHITE)
                        }
                        layoutParams = LinearLayout.LayoutParams(
                            LinearLayout.LayoutParams.MATCH_PARENT,
                            LinearLayout.LayoutParams.WRAP_CONTENT
                        ).apply { setMargins(0, 0, 0, 16) }
                    }
                    chatContainer.addView(textView)
                }
                // Scroll automat jos
                scrollViewChat.post { scrollViewChat.fullScroll(ScrollView.FOCUS_DOWN) }
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        chatManager.disconnect()
    }
}