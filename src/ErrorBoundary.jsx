import { IonText } from "@ionic/react";
import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            backgroundColor: "#ffe6e6",
            color: "#b00020",
            padding: "1rem",
            borderRadius: "12px",
            margin: "6em",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            overflowY: "auto",
          }}
        >
          <IonText>Something went wrong 😞</IonText>
          <p><strong>Error:</strong> {this.state.error?.toString()}</p>
          {this.state.errorInfo && (
            <details>
              <summary>Stack trace</summary>
              <pre>{this.state.errorInfo.componentStack}</pre>
            </details>
          )}
          <button
            onClick={this.handleReload}
            style={{
              marginTop: "1rem",
              background: "#b00020",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "0.5rem 1rem",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
