package com.utp.dapp;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import plugin.SocketThread.SocketThread;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(SocketThread.class);
    }
}
