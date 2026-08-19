package com.europass.cveditor;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onResume() {
        super.onResume();
        if (this.bridge != null) {
            WebView webView = this.bridge.getWebView();
            if (webView != null) {
                WebSettings settings = webView.getSettings();
                settings.setUseWideViewPort(true);
                settings.setLoadWithOverviewMode(true);
                settings.setSupportZoom(true);
                settings.setBuiltInZoomControls(true);
                settings.setDisplayZoomControls(false);
                
                // Force Desktop User Agent
                String newUserAgent = settings.getUserAgentString();
                newUserAgent = newUserAgent.replace("Mobile", "eliboM").replace("Android", "diordnA");
                // Or simply set to a Chrome Windows UA:
                settings.setUserAgentString("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36");

                // Inject Android Print Bridge
                webView.addJavascriptInterface(new Object() {
                    @android.webkit.JavascriptInterface
                    public void printDocument() {
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                android.print.PrintManager printManager = (android.print.PrintManager) getSystemService(android.content.Context.PRINT_SERVICE);
                                android.print.PrintDocumentAdapter printAdapter = webView.createPrintDocumentAdapter("Europass_Document");
                                printManager.print("Europass CV", printAdapter, new android.print.PrintAttributes.Builder().build());
                            }
                        });
                    }

                    @android.webkit.JavascriptInterface
                    public void savePdfToDownloads(String base64Data, String filename) {
                        try {
                            byte[] pdfAsBytes = android.util.Base64.decode(base64Data, android.util.Base64.DEFAULT);
                            java.io.OutputStream os = null;
                            String subFolderName = "Europass_CVs";
                            final android.net.Uri finalUri;

                            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
                                android.content.ContentResolver resolver = getContentResolver();
                                android.content.ContentValues contentValues = new android.content.ContentValues();
                                contentValues.put(android.provider.MediaStore.MediaColumns.DISPLAY_NAME, filename);
                                contentValues.put(android.provider.MediaStore.MediaColumns.MIME_TYPE, "application/pdf");
                                contentValues.put(android.provider.MediaStore.MediaColumns.RELATIVE_PATH, android.os.Environment.DIRECTORY_DOWNLOADS + java.io.File.separator + subFolderName);
                                android.net.Uri uri = resolver.insert(android.provider.MediaStore.Downloads.EXTERNAL_CONTENT_URI, contentValues);
                                if (uri != null) {
                                    os = resolver.openOutputStream(uri);
                                }
                                finalUri = uri;
                            } else {
                                java.io.File basePath = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOWNLOADS);
                                java.io.File dir = new java.io.File(basePath, subFolderName);
                                if (!dir.exists()) {
                                    dir.mkdirs();
                                }
                                java.io.File file = new java.io.File(dir, filename);
                                os = new java.io.FileOutputStream(file, false);
                                finalUri = androidx.core.content.FileProvider.getUriForFile(MainActivity.this, getPackageName() + ".fileprovider", file);
                            }

                            if (os != null) {
                                os.write(pdfAsBytes);
                                os.flush();
                                os.close();
                                runOnUiThread(new Runnable() {
                                    @Override
                                    public void run() {
                                        android.widget.Toast.makeText(MainActivity.this, "PDF saved to Downloads/" + subFolderName + "!", android.widget.Toast.LENGTH_LONG).show();
                                        try {
                                            android.content.Intent intent = new android.content.Intent(android.content.Intent.ACTION_VIEW);
                                            intent.setDataAndType(finalUri, "application/pdf");
                                            intent.setFlags(android.content.Intent.FLAG_ACTIVITY_NO_HISTORY | android.content.Intent.FLAG_GRANT_READ_URI_PERMISSION);
                                            
                                            android.content.Intent chooser = android.content.Intent.createChooser(intent, "Open PDF with...");
                                            startActivity(chooser);
                                        } catch (Exception e) {
                                            android.widget.Toast.makeText(MainActivity.this, "No PDF viewer found on device", android.widget.Toast.LENGTH_SHORT).show();
                                        }
                                    }
                                });
                            } else {
                                throw new java.io.IOException("Failed to create file");
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                            final String msg = e.getMessage();
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    android.widget.Toast.makeText(MainActivity.this, "Failed to save PDF: " + msg, android.widget.Toast.LENGTH_LONG).show();
                                }
                            });
                        }
                    }
                }, "AndroidPrinter");
            }
        }
    }
}
