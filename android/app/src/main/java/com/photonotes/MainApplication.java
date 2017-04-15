package com.photonotes;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.aakashns.reactnativedialogs.ReactNativeDialogsPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.image.zoom.ReactImageZoom;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.photomodule.MyPhotoViewPackage;
import com.rnfs.RNFSPackage;
import com.imagepicker.ImagePickerPackage;
import com.facebook.soloader.SoLoader;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.RNFetchBlob.RNFetchBlobPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new ReactNativeDialogsPackage(),
            new ImageResizerPackage(),
            new ReactImageZoom(),
            new RNFSPackage(),
            new ImagePickerPackage(),
            new GoogleAnalyticsBridgePackage(),
            new MyPhotoViewPackage(),
            new RNFetchBlobPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
