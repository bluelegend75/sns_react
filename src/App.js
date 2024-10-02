import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const App = () => {
  const [username, setUsername] = useState("");
  const usernameRef = useRef("");
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const ws = useRef(null);
  const [currentUser, setCurrentUser] = useState("");
  const messagesEndRef = useRef(null); // 스크롤 컨테이너 참조

  useEffect(() => {
    if (!ws.current) {
      // WebSocket 연결이 이미 되어 있지 않을 때만 연결
      // WebSocket 서버에 연결
      ws.current = new WebSocket("ws://192.168.30.6:5000");
      console.log("서버에 연결되었습니다.)");

      // 메시지 수신 처리, WebSocket 연결에서 메시지를 수신할 때 호출되는 이벤트 핸들러
      ws.current.onmessage = (event) => {
        console.log("ws.current.onmessage");
        const newMessage = JSON.parse(event.data);
        setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      };

      // WebSocket 종료 시
      ws.current.onclose = () => {
        console.log("WebSocket 연결이 종료되었습니다.");
      };
    }

    return () => {
      if (ws.current.readyState === WebSocket.OPEN) {
        console.log("return ()");
        ws.current.close();
      }
    };
  }, []);

  useEffect(() => {
    // chatMessages가 업데이트될 때마다 스크롤을 맨 아래로 이동
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = () => {
    console.log("handleSendMessage:", username, message);
    if (message && username) {
      const chatData = { username, message };
      ws.current.send(JSON.stringify(chatData));
      console.log("Message sent:", chatData);
      setMessage(""); // 입력 필드 초기화
    }
  };
  const handleEnterChat = () => {
    if (usernameRef.current.value) {
      setCurrentUser(usernameRef.current.value);
      setUsername(usernameRef.current.value); // 버튼 클릭 시에만 대화명 설정
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 엔터 키의 기본 동작을 방지
      handleSendMessage();
    }
  };

  return (
    <div className="container">
      {!username && (
        <div>
          <h2>대화명을 입력하세요:</h2>
          <input
            type="text"
            ref={usernameRef} // useRef로 대화명을 관리
            className="username-input"
            placeholder="대화명을 입력하세요"
          />
          <button onClick={handleEnterChat} className="enter-chat-button">
            대화방 입장
          </button>
        </div>
      )}
      {username && (
        <div>
          <h2>실시간 상담 - {username}</h2>
          <div className="chat-container">
            {chatMessages.map((msg, index) => {
if (msg.username === currentUser) {
    return (
      <div key={index} className="message message-right">
        <div className="right-content">
          <strong>{msg.username}:</strong> <p>{msg.message}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div key={index} className="message message-left">
        <div className="left-content">
          <strong>{msg.username}:</strong> <p>{msg.message}</p>
        </div>
      </div>
    );
  }

              // <div
              //   key={index}
              //   className={`message ${msg.username === currentUser ? "message-right" : "message-left"}`}
              //   // style={{
              //   //   textAlign: msg.username === currentUser ? "right" : "left",
              //   //   backgroundColor: msg.username === currentUser ? "#e0ffe0" : "#f0f0f0",
              //   //   padding: "5px",
              //   //   margin: "5px 0",
              //   //   borderRadius: "10px",
              //   // }}
              // >
              //   <strong>{msg.username}:</strong> <p>{msg.message}</p>
              // </div>
})}
            <div ref={messagesEndRef} /> {/* 스크롤 끝을 참조 */}
          </div>
          <textarea
            name="message"
            className="message-input"
            // rows="5"
            // style={{ width: "296px", height:"80px" }}
            cols="30"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요"
          ></textarea>
          <br></br>
          <button onClick={handleSendMessage} className="send-button">
            보내기
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
