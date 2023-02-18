import React, { useEffect, useState } from "react"
import axios from "axios"

function App() {

  useEffect(() => {
    if (localStorage.getItem("token") && !token) {
      setToken(JSON.stringify(localStorage.getItem("token")))
    }
  }, [])

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setverifyButton(true)
    }
  },[])

  useEffect(() => {
    if (authErrorKontrol) {
      setAuthMessage(false)
    }
    if (authMessage) {
      setAuthErrorKontrol(false)
    }
  },[])

  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("")
  const [SuccessMessage, setSuccessMessage] = useState("")
  const [token, setToken] = useState(null)
  const [kontrol, setKontrol] = useState(false)
  const [kontrol2, setKontrol2] = useState(false)
  const [authMessage, setAuthMessage] = useState("")
  const [authErrorMessage, setAuthErrorMessage] = useState("")
  const [authErrorKontrol, setAuthErrorKontrol] = useState(false)
  const [verifyButton, setverifyButton] = useState(false)
  const [timerControl, setTimerControl] = useState(false)

  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    let interval = null;
    if (timerControl) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);
    }
    if (seconds === 0) {
      clearInterval(interval);
      setTimerControl(false)
      setSeconds(60)
    }

    return () => clearInterval(interval);
  }, [timerControl, seconds]);


  const handleLogin = async (e) => {
    e.preventDefault()
    await axios.post("http://localhost:5000/login", { email }).then(res => {
      localStorage.setItem("token", JSON.stringify(res.data.token))
      setToken(JSON.stringify(localStorage.getItem("token")))

      setverifyButton(true)
      setKontrol2(true)
      setSuccessMessage(res.data.message)
      setSeconds(60)
      setTimerControl(true)
      setTimeout(() => {
        setKontrol2(false)
      }, 3000);

      console.log(res.data.token)
      console.log(res.data.message)
    }).catch(error => {
      setKontrol(true)
      setErrorMessage(error.response.data.message)
      setTimeout(() => {
        setKontrol(false)
      }, 3000);

    })
  }

  const verifyToken = async () => {
    await axios.get("http://localhost:5000/auth", {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      }
    }).then(response => {
      setAuthMessage(response.data.message)
      console.log(response.data);
    }).catch(error => {
      setAuthErrorKontrol(true)
      setAuthErrorMessage(error.response.data.message.message)
    });
  }

  return (
    <div className="App">
      <h1 style={{
        marginLeft: "600px"
      }}>{authMessage}</h1>
      {
        authErrorKontrol ? <h1 style={{
          marginLeft: "600px"
        }}>{authErrorMessage}</h1> : null
      }
      <div>
        {
          kontrol ? <label style={{
            position: "relative",
            left: "650px"
          }}>{errorMessage}</label> : null
        }
        {
          kontrol2 ? <label style={{
            position: "relative",
            left: "660px"
          }}>{SuccessMessage}</label> : null
        }
        <br></br>
        <div>
          <div style={{
            position: "relative",
            left: "630px"
          }}>
            <form onSubmit={handleLogin}>
              <input type="text" onChange={e => setEmail(e.target.value)} placeholder="Email"></input>
              <br />
              <br />
              <button style={{
                position: "relative",
                left: "45px"
              }}>Submit</button>
            </form>
            <br />
            <br />
            {
              verifyButton ? <button onClick={verifyToken} style={{
                position: "relative",
                left: "25px"
              }}>Authentication</button> : null
            }
          </div>
          <div>
            {
              localStorage.getItem("token") ? <label><br /> <br />
                <span style={{
                  position: "relative",
                  left: "670px"
                }}>Your Token</span>
                <br />
                <br />
                <span style={{
                  position: "relative",
                  left: "100px"
                }}>{localStorage.getItem("token")}</span></label> : null
            }
          </div>

          {
            timerControl ? <div style={{
              position: "relative",
              left: "600px"
            }}>
              <h1>Jwt Expired in: {seconds}</h1>
            </div>
              : null
          }

        </div>
      </div>
    </div >
  );
}

export default App;
