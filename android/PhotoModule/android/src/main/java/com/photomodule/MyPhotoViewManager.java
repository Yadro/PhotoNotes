package com.photomodule;

import android.graphics.Color;
import android.graphics.ColorMatrix;
import android.graphics.ColorMatrixColorFilter;
import android.graphics.PorterDuff;
import android.support.annotation.Nullable;

import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.controller.AbstractDraweeControllerBuilder;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;


public class MyPhotoViewManager extends SimpleViewManager<MyImageView> {
    public static final String REACT_CLASS = "RCTPhotoView";
    public AbstractDraweeControllerBuilder mDraweeControllerBuilder;
    public Object mCallerContext;

    private static ColorMatrix grey = new ColorMatrix(new float[] {
        0.2989f, 0.5870f, 0.1140f, 0, 0,
        0.2989f, 0.5870f, 0.1140f, 0, 0,
        0.2989f, 0.5870f, 0.1140f, 0, 0,
        0, 0, 0, 1, 0
    });

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    public MyPhotoViewManager(
            AbstractDraweeControllerBuilder draweeControllerBuilder,
            Object callerContext) {
        mDraweeControllerBuilder = draweeControllerBuilder;
        mCallerContext = callerContext;
    }

    public MyPhotoViewManager(ReactApplicationContext context) {
        // Lazily initialize as FrescoModule have not been initialized yet
        mDraweeControllerBuilder = null;
        mCallerContext = null;
    }

    public AbstractDraweeControllerBuilder getDraweeControllerBuilder() {
        if (mDraweeControllerBuilder == null) {
            mDraweeControllerBuilder = Fresco.newDraweeControllerBuilder();
        }
        return mDraweeControllerBuilder;
    }

    @Override
    public MyImageView createViewInstance(ThemedReactContext context) {
        return new MyImageView(context.getApplicationContext());
    }

    @ReactProp(name = "src")
    public void setSrc(MyImageView view, @Nullable String sources) {
        view.setImageBitmap(sources);
    }

    @ReactProp(name = "value")
    public void setValue(MyImageView view, double value) {
        this.applyColorFilter(view, (int) value);
    }

    /*@ReactProp(name = "borderRadius", defaultFloat = 0f)
    public void setBorderRadius(ReactImageView view, float borderRadius) {
        view.setBorderRadius(borderRadius);
    }

    @ReactProp(name = ViewProps.RESIZE_MODE)
    public void setResizeMode(ReactImageView view, @Nullable String resizeMode) {
        view.setScaleType(ImageResizeMode.toScaleType(resizeMode));
    }*/

    private void applyColorFilter(MyImageView view, int value) {
        if (value <= 0) {
            view.clearColorFilter();
        } else {
            view.setColorFilter(new ColorMatrixColorFilter(grey));
            view.setColorFilter(new ColorMatrixColorFilter(MyPhotoViewManager.createThresholdMatrix(value)));
        }
    }

    // matrix that changes gray scale picture into black and white at given threshold.
    // It works this way:
    // The matrix after multiplying returns negative values for colors darker than threshold
    // and values bigger than 255 for the ones higher.
    // Because the final result is always trimed to bounds (0..255) it will result in bitmap made of black and white pixels only
    private static ColorMatrix createThresholdMatrix(int threshold) {
        return new ColorMatrix(new float[] {
                85.f, 85.f, 85.f, 0.f, -255.f * threshold,
                85.f, 85.f, 85.f, 0.f, -255.f * threshold,
                85.f, 85.f, 85.f, 0.f, -255.f * threshold,
                0f, 0f, 0f, 1f, 0f
        });
    }
}
