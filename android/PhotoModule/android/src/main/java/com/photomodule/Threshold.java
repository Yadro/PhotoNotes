package com.photomodule;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.ColorMatrix;
import android.graphics.ColorMatrixColorFilter;
import android.graphics.Paint;
import android.net.Uri;
import android.provider.MediaStore;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.io.File;
import java.io.FileOutputStream;


public class Threshold extends ReactContextBaseJavaModule {

    public Threshold(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "Threshold";
    }

    @ReactMethod
    public void readThresholdSave(String filepath, String outpath, int threshold, Promise promise) {
        try {
            File original = this.readFile(filepath);
            Bitmap bitmap = BitmapFactory.decodeFile(original.getAbsolutePath());
            File result;
            if (threshold <= 0) {
                result = original;
            } else {
                Bitmap bitmapThreshold = this.threshold(bitmap, threshold);
                result = this.saveBitmapAsPng(outpath, bitmapThreshold);
            }

            Uri uri = this.getImageUriOnFilepath(result);
            promise.resolve(this.generateSuccessResponse(uri, threshold <= 0 ? filepath : outpath));
        } catch (Exception e) {
            promise.reject("error", e.getMessage());
        }
    }

    private WritableMap generateSuccessResponse(Uri uri, String filepath) {
        WritableMap response = Arguments.createMap();
        response.putString("uri", uri.toString());
        response.putString("filepath", filepath);
        response.putString("status", "success");
        return response;
    }

    //
    private Uri getImageUriOnFilepath(File imageFile) {
        Context context = getReactApplicationContext();
        String filePath = imageFile.getAbsolutePath();

        Cursor cursor = context.getContentResolver().query(
                MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                new String[] { MediaStore.Images.Media._ID },
                MediaStore.Images.Media.DATA + "=? ",
                new String[] { filePath }, null);

        if (cursor != null && cursor.moveToFirst()) {
            int id = cursor.getInt(cursor.getColumnIndex(MediaStore.MediaColumns._ID));
            cursor.close();
            return Uri.withAppendedPath(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, "" + id);
        } else {
            if (imageFile.exists()) {
                ContentValues values = new ContentValues();
                values.put(MediaStore.Images.Media.DATA, filePath);
                return context.getContentResolver().insert(
                        MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
            }
        }
        return null;
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

    private File saveBitmapAsPng(String filename, Bitmap bitmap) {
        try {
            FileOutputStream out = new FileOutputStream(filename);
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, out);
            return readFile(filename);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private Bitmap threshold(Bitmap bitmap, int threshold) {
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
        bitmapPaint.setColorFilter(new ColorMatrixColorFilter(createThresholdMatrix(threshold)));
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
