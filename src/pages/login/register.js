import React, { useEffect, useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import style from "./loginStyle.module.css"
import { UserContext } from "../../context/userContext"

import api from "../../api/api"

export default function Login() {
  const { user, setUser } = useContext(UserContext)
  const [confPass, setConfPass] = useState("")

  useEffect(() => {
    setUser({})
  }, [])

  function setPassword(event) {
    setUser((prev) => {
      return { ...prev, password: event.target.value }
    })
  }

  function setEmail(event) {
    setUser((prev) => {
      return { ...prev, email: event.target.value }
    })
  }
  function setName(event) {
    setUser((prev) => {
      return { ...prev, username: event.target.value }
    })
  }
  function setConfirmPassword(event) {
    setConfPass((prev) => {
      return event.target.value
    })
  }

  let navigate = useNavigate()
  console.log(user)
  async function submit() {
    if (!user.username) {
      alert("enter username")
      return
    }
    if (!user.email) {
      alert("enter email")
      return
    }
    if (!user.password) {
      alert("enter password")
      return
    }
    if (user.password !== confPass) {
      alert("Password doesn't match")
      setUser((prev) => {
        return { ...prev, password: "", confirmPassword: "" }
      })
      return
    }

    try {
      const res = await api.post("/Users/", {
        username: user.username,
        password: user.password,
        email: user.email,
      })
      setUser(res.data)
      navigate("/home")
    } catch (err) {
      setUser({})
      if (err.response.status === 409) alert("user exists")
    }
  }

  return (
    <div className={style.loginPage}>
      <form className={style.loginBox} onSubmit={submit}>
        <h1>Travel Records</h1>
        <input
          onChange={setName}
          placeholder="username"
          type="text-box"
        ></input>
        <input onChange={setEmail} placeholder="email" type="email"></input>
        <input
          onChange={setPassword}
          placeholder="password"
          type="password"
        ></input>
        <input
          onChange={setConfPass}
          placeholder="confirm password"
          type="password"
        ></input>
        <input type="submit" className={style.button} value={"Login"}></input>
        <div className={style.loginBoxText}>
          <p>already have an account? </p>
          <Link className={style.link} to="/">
            login
          </Link>
        </div>
      </form>
    </div>
  )
}
