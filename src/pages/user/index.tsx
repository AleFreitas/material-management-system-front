import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

interface User {
  nome: string;
  sobrenome: string;
  funcao: string;
  email: string;
  senha: string;
  url_imagem: string;
}

const UserComponent: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("userToken");

    if (!userId) {
      console.error("No user ID found in session storage");
      return;
    }

    axios
      .get<User>(`http://localhost:5005/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the user data:", error);
      });
  }, []);

  if (!userData)
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>Loading...</p>
      </div>
    );

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "500px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        User Information
      </h1>
      <button style={{ width: "80px" }}>
        <FontAwesomeIcon
          icon={faHouse}
          onClick={(e) => {
            e.preventDefault();
            navigate("/home");
          }}
          style={{ cursor: "pointer" }}
        />
      </button>
      <div
        style={{
          backgroundColor: "black",
          padding: "15px",
          borderRadius: "8px",
          width: "100%",
        }}
      >
        <p>Nome: {userData.nome}</p>
        <p>Sobrenome: {userData.sobrenome}</p>
        <p>Email: {userData.email}</p>
      </div>
    </div>
  );
};

export default UserComponent;
