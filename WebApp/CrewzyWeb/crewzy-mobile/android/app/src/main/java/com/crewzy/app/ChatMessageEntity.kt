import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "chat_messages")
data class ChatMessageEntity(
    @PrimaryKey(autoGenerate = true) val localId: Int = 0, // ID-ul din baza de date a telefonului
    val userId: String,
    val userName: String,
    val text: String,
    val timestamp: String
)