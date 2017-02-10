package com.example.threshold;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.ColorMatrix;
import android.graphics.ColorMatrixColorFilter;
import android.graphics.Paint;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;


public class ThresholdModule extends ReactContextBaseJavaModule {

    public ThresholdModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ThresholdManager";
    }

    @ReactMethod
    public void readThresholdSave(String filepath, String outpath, Promise promise) {
        try {
            File file = readFile(filepath);
            Bitmap bitmap = BitmapFactory.decodeFile(file.getAbsolutePath());
            Bitmap threshold = threshold(bitmap);
            saveBitmapAsPng(outpath, threshold);
            promise.resolve("success");
        } catch (Exception e) {
            promise.reject("error", e.getMessage());
        }
    }

    private File readFile(String filepath) throws Exception {
        File file = new File(filepath);

        if (file.isDirectory()) {
            throw new Exception("EISDIR: illegal operation on a directory, read");
        }

        if (!file.exists()) {
            throw new Exception("ENOENT: no such file or directory, open '");
        }
        return file;
    }

    private void saveBitmapAsPng(String filename, Bitmap bitmap) {
        try {
            FileOutputStream out = new FileOutputStream(filename);
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, out);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
    }

    private Bitmap threshold(Bitmap bitmap) {
        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inScaled = false;

        // prepare destination bitmap
        Bitmap result = Bitmap.createBitmap(bitmap.getWidth(), bitmap.getHeight(),  Bitmap.Config.ARGB_8888);
        Canvas c = new Canvas(result);
        Paint bitmapPaint = new Paint();

        //first convert bitmap to grey scale:
        bitmapPaint.setColorFilter(new ColorMatrixColorFilter(createGreyMatrix()));
        c.drawBitmap(bitmap, 0, 0, bitmapPaint);

        //then convert the resulting bitmap to black and white using threshold matrix
        bitmapPaint.setColorFilter(new ColorMatrixColorFilter(createThresholdMatrix(128)));
        c.drawBitmap(result, 0, 0, bitmapPaint);

        return result;
    }

    private static ColorMatrix createGreyMatrix() {
        ColorMatrix matrix = new ColorMatrix(new float[] {
                0.2989f, 0.5870f, 0.1140f, 0, 0,
                0.2989f, 0.5870f, 0.1140f, 0, 0,
                0.2989f, 0.5870f, 0.1140f, 0, 0,
                0, 0, 0, 1, 0
        });
        return matrix;
    }

    // matrix that changes gray scale picture into black and white at given threshold.
    // It works this way:
    // The matrix after multiplying returns negative values for colors darker than threshold
    // and values bigger than 255 for the ones higher.
    // Because the final result is always trimed to bounds (0..255) it will result in bitmap made of black and white pixels only
    private static ColorMatrix createThresholdMatrix(int threshold) {
        ColorMatrix matrix = new ColorMatrix(new float[] {
                85.f, 85.f, 85.f, 0.f, -255.f * threshold,
                85.f, 85.f, 85.f, 0.f, -255.f * threshold,
                85.f, 85.f, 85.f, 0.f, -255.f * threshold,
                0f, 0f, 0f, 1f, 0f
        });
        return matrix;
    }
}
