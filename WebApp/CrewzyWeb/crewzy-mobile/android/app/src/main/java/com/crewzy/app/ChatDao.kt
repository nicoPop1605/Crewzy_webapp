import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query

@Dao
interface ChatDao {
    // 1. Luăm toate mesajele, ordonate după cum au intrat
    @Query("SELECT * FROM chat_messages ORDER BY localId ASC")
    suspend fun getAllMessages(): List<ChatMessageEntity>

    // 2. Salvăm un mesaj nou venit de pe WebSockets
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMessage(message: ChatMessageEntity)

    // 3. Salvăm istoricul venit de la server la conectare
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(messages: List<ChatMessageEntity>)
    
    // (Opțional) Ștergem tot dacă vrem să facem clear
    @Query("DELETE FROM chat_messages")
    suspend fun clearAll()
}