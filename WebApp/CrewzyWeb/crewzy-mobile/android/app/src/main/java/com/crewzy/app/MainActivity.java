package com.crewzy.app; // Asigură-te că e pachetul tău corect

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Legăm interfața XML creată adineauri
        setContentView(R.layout.activity_main);

        // Găsim butonul din interfață
        Button btnOpenChat = findViewById(R.id.btnOpenChat);

        // Setăm acțiunea de click pe buton
        btnOpenChat.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Aici facem trecerea din Java (MainActivity) în Kotlin (ChatActivity)
                Intent intent = new Intent(MainActivity.this, ChatActivity.class);
                startActivity(intent);
            }
        });
    }
}