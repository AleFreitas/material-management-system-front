import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const UserComponent: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [userLoans, setUserLoans] = useState<Loan[] | null>([]);

  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("userToken");

  useEffect(() => {
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

  useEffect(() => {
    axios
      .get<Loan[]>(`http://localhost:5005/user/${userId}/loan`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setUserLoans(response.data);
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
      <button
        style={{ width: "80px" }}
        onClick={(e) => {
          e.preventDefault();
          navigate("/home");
        }}
      >
        <FontAwesomeIcon icon={faHouse} style={{ cursor: "pointer" }} />
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
      <h2>Empréstimos</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {userLoans?.map((loan, index) => {
          return (
            <div
              key={index}
              style={{
                backgroundColor: "black",
                padding: "15px",
                borderRadius: "8px",
                width: "100%",
                marginBottom: "10px",
              }}
            >
              <p>Produto: {loan.id}</p>
              <p>
                Data de empréstimo:{" "}
                {new Date(loan.data_emprestimo).toLocaleDateString()}
              </p>
              <p>
                Data de devolução:{" "}
                {new Date(loan.data_devolucao).toLocaleDateString()}
              </p>
              <p>Multa: {loan.multa}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserComponent;
