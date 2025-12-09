//
//  ContentView.swift
//  AppClip
//
//  Created by Sol Emilio on 12/5/25.
//


import SwiftUI

struct ContentView: View {
    var body: some View {
        ClipWebView()  // ← NO PARAMETERS
            .ignoresSafeArea()
            .navigationBarHidden(true)
    }
}

#Preview {
    ContentView()
}
