package com.photomodule;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.ColorMatrixColorFilter;
import android.widget.ImageView;

import com.facebook.react.views.image.ReactImageView;

import java.io.File;

public class MyImageView extends ImageView {

    String imagePath;
    Bitmap bitmap;

    public MyImageView(Context context) {
        super(context);
    }

    public void setImageBitmap(String source) {
        if (imagePath != null && imagePath.equals(source)) {
            return;
        }
        File file = new File(source);
        if (!file.exists()) {
            return;
        }
        bitmap = BitmapFactory.decodeFile(source);
        this.setImageBitmap(bitmap);
        this.setMinimumWidth(100);
        this.setMinimumHeight(100);
        this.setScaleType(ScaleType.FIT_CENTER);
    }
}
