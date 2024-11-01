import { useEffect, useState } from "react";
import Header from "./components/Header";
import { Layout, Space } from "antd";
import GlobalStore, { appState } from "../../shared/globalStore";
import EventBus from "../../shared/eventBus";
import DataSetCreationForm from "./components/DataSetCreationForm";

const { Footer, Content } = Layout;

const layoutStyle = {
  height: "100vh",
};

function App() {
  const [data, setData] = useState(GlobalStore.getInstance().getState());

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onmessage = (event) => {
      const newState = JSON.parse(event.data);
      console.log("WebSocket data received:", newState);
      setData(newState);
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const listener = (newState: appState) => {
      console.log(newState, "newState");
      setData(newState);
    };

    // Subscribe to state updates
    GlobalStore.getInstance().subscribe(listener);

    // Subscribe to event updates
    EventBus.getInstance().on("dataUpdated", setData);

    return () => {
      GlobalStore.getInstance().unsubscribe(listener);
      EventBus.getInstance().off("dataUpdated", setData);
    };
  }, []);

  return (
    <Layout style={layoutStyle}>
      <Header />
      <Content>
        <DataSetCreationForm />
        <Space direction="horizontal" />
        {data.items?.length > 0 && (
          <ul>
            {data.items?.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
      </Content>
      <Footer>Footer</Footer>
    </Layout>
  );
}

export default App;
