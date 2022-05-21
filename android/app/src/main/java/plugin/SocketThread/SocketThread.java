package plugin.SocketThread;

import android.Manifest;

import androidx.annotation.NonNull;

import com.getcapacitor.JSObject;
import com.getcapacitor.Logger;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.annotations.Nullable;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreException;
import com.google.firebase.firestore.ListenerRegistration;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

@CapacitorPlugin(
    name = "SocketThread",
    permissions = {
        @Permission(
            alias = "camera",
            strings = { Manifest.permission.CAMERA }
        ),
        @Permission(
            alias = "storage",
            strings = {
                Manifest.permission.READ_EXTERNAL_STORAGE,
                Manifest.permission.WRITE_EXTERNAL_STORAGE
            }
        )
    }
)
public class SocketThread extends Plugin {
    @PluginMethod()
    public void requestStoragePermissions(PluginCall call) {
        requestPermissionForAlias("storage", call, "storagePermsCallback");
    }

    @PermissionCallback
    private void storagePermsCallback(PluginCall call) {
        Logger.info("Has Permissions");
        JSObject response = new JSObject();
        response.put("storage", "granted");
        call.resolve(response);
    }

    @PluginMethod()
    public void startConnectionThread(PluginCall call) {
        FirebaseAuth.getInstance().signInWithEmailAndPassword(call.getString("email"), call.getString("pass"))
            .addOnCompleteListener(new OnCompleteListener<AuthResult>() {
            @Override
            public void onComplete(@NonNull Task<AuthResult> task) {
                if (task.isSuccessful()) {
                    FirebaseFirestore db = FirebaseFirestore.getInstance();
                    checkForFileUploads(db);
                } else {
                    // If sign in fails, display a message to the user.
                    Logger.error("ne moa se logna");
                }
            }
        });

    }

    @PluginMethod()
    public void retrieveChunksFromDevice(PluginCall call) {
        String fileName = "/storage/self/primary/Documents/chunks5.txt";
        File file = new File(fileName);
        StringBuilder chunks = new StringBuilder();

        if (!file.exists()) {
            call.reject("No file with chunks exists");
            return;
        }

        try {
            Scanner reader = new Scanner(file);
            while (reader.hasNextLine()) {
                chunks.append(reader.nextLine());
            }

            JSObject response = new JSObject();
            response.put("chunks", chunks.toString());
            reader.close();
            call.resolve(response);
        } catch (FileNotFoundException e) {
            call.reject("No file with chunks exists");
        }
    }

    @PluginMethod
    public void cleanFile(PluginCall call) {
        String fileName = "/storage/self/primary/Documents/chunks5.txt";
        File file = new File(fileName);

        try {
            PrintWriter stream = new PrintWriter(fileName);

            stream.write("");
            stream.close();
            call.resolve();
        } catch (IOException e) {
            Logger.info("An error occurred.");
            call.reject(e.getLocalizedMessage());
        }
    }

    private void writeChunksToFile(QuerySnapshot data) {
        String fileName = "/storage/self/primary/Documents/chunks5.txt";
        this.createChunksFile(fileName);

        try(FileWriter fw = new FileWriter(fileName, true);
            BufferedWriter bw = new BufferedWriter(fw);
            PrintWriter out = new PrintWriter(bw))
        {

            for (QueryDocumentSnapshot doc : data) {
                String mapId = doc.get("map_id").toString();
                String chunkValue = doc.get("chunk").toString();
                out.write(mapId + chunkValue);
                out.println("--BREAK--");
            }
        } catch (IOException e) {
            Logger.info("kur");
            //exception handling left as an exercise for the reader
        }

    }

    private void createChunksFile(String name) {
        File file = new File(name);

        try {
            if (!file.exists()) {
                file.createNewFile();
                file.setWritable(true);
                file.setReadable(true, false);
            }
        } catch (IOException e ){
            Logger.info("file error 116");
        }
    }

    private void checkForFileUploads(FirebaseFirestore db) {
        String userId = FirebaseAuth.getInstance().getCurrentUser().getUid();
        this.checkForFileRequests(db);

        Thread running = new Thread(new Runnable() {
            @Override
            public void run() {
                ListenerRegistration listener = db.collection("chunks")
                    .whereEqualTo("user_id", userId)
                    .addSnapshotListener(
                        new EventListener<QuerySnapshot>() {
                            @Override
                            public void onEvent(@Nullable QuerySnapshot value,
                                                @Nullable FirebaseFirestoreException e) {
                                if (e != null) {
                                    Logger.error("Listen failed.");
                                    return;
                                }

                                writeChunksToFile(value);
                            }
                        }
                    );
            }
        });

        running.start();
    }

    private void checkForFileRequests(FirebaseFirestore db) {
        String fileName = "/storage/self/primary/Documents/chunks5.txt";
        File file = new File(fileName);
        StringBuilder chunks = new StringBuilder();

        try {
            Scanner reader = new Scanner(file);
            while (reader.hasNextLine()) {
                chunks.append(reader.nextLine());
            }

            JSObject response = new JSObject();
            response.put("chunks", chunks.toString());
            reader.close();
        } catch (FileNotFoundException e) {
            Logger.error(e.getLocalizedMessage());
        }

        ArrayList<JSObject> mapIds = new ArrayList<JSObject>();
        String[] splitedChunks = chunks.toString().split("--BREAK--");

        if (splitedChunks.length > 1) {
            for (String chunk: splitedChunks) {
                JSObject chunkWithMapId = new JSObject();
                chunkWithMapId.put("mapId", chunk.substring(0, 20));
                chunkWithMapId.put("chunk", chunk.substring(20, chunk.length()));

                mapIds.add(chunkWithMapId);
            }
        }

        Thread running = new Thread(new Runnable() {
            public ArrayList<JSObject> maps = mapIds;

            @Override
            public void run() {
                ListenerRegistration listener = db.collection("build-requests")
                    .addSnapshotListener(
                        new EventListener<QuerySnapshot>() {
                            @Override
                            public void onEvent(@Nullable QuerySnapshot value,
                                                @Nullable FirebaseFirestoreException e) {
                                if (e != null) {
                                    Logger.error("Listen failed.");
                                    return;
                                }

                                for (QueryDocumentSnapshot request: value) {
                                    if (request.get("mapId") == null) {
                                        continue;
                                    }

                                    String mapId = request.get("mapId").toString();

                                    for (JSObject chunkMap: maps) {
                                        try {
                                            String opa = chunkMap.getString("mapId");
                                            if (opa.equals(mapId)) {
                                                Map<String, Object> reqeustChunk = new HashMap<>();
                                                reqeustChunk.put("chunk", chunkMap.get("chunk"));
                                                reqeustChunk.put("mapId", chunkMap.get("mapId"));

                                                db.collection("request-chunks").add(reqeustChunk);
                                            }
                                        } catch (JSONException jsonException) {
                                            jsonException.printStackTrace();
                                        }
                                    }
                                }
                            }
                        }
                    );
            }
        });

        running.start();
    }
}
