import SwiftUI
import WebKit
import os.log

struct ClipWebView: UIViewRepresentable {
    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        #if DEBUG
        webView.configuration.preferences.setValue(true, forKey: "developerExtrasEnabled")
        #endif
        loadClipHTML(webView)
        return webView
    }
    
    func updateUIView(_ webView: WKWebView, context: Context) {}
    
    private func loadClipHTML(_ webView: WKWebView) {
        print("🔍 App Clip bundle path: \(Bundle.main.bundlePath)")
        
        guard let htmlURL = Bundle.main.url(
            forResource: "index-clip",
            withExtension: "html",
            subdirectory: "dist-clip"
        ) else {
            print("❌ ERROR: index.html NOT FOUND in dist-clip/")
            
            // ✅ FIXED - List dist-clip folder contents
            if let distClipURL = Bundle.main.url(forResource: "", withExtension: nil, subdirectory: "dist-clip") {
                let contents = try? FileManager.default.contentsOfDirectory(at: distClipURL, includingPropertiesForKeys: nil)
                print("📂 dist-clip contents:")
                contents?.forEach { print("  📄 \($0.lastPathComponent)") }
            } else {
                print("❌ dist-clip folder NOT FOUND")
            }
            return
        }
        
        print("✅ Found HTML: \(htmlURL.path)")
        let baseURL = htmlURL.deletingLastPathComponent()
        print("📁 Base directory: \(baseURL.path)")
        
        webView.loadFileURL(htmlURL, allowingReadAccessTo: baseURL)
        print("🚀 Loading WKWebView: \(htmlURL)")
    }
}
