import React, { useEffect, useState } from 'react'
import axios from 'axios'

const App = () => {
  const [input, setInput] = useState('')
  const [backendData, setBackendData] = useState()
  const [validation, setValidation] = useState({
    lengthCheck: false,
    hasLowerCase: false,
    hasUpperCase: false,
    hasDigit: false,
    hasRepeatingChars: false,
  })

  const fetchAll = async () => {
    const Naveen = await axios.get('http://localhost:8080/password')
    setBackendData(Naveen.data)
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const minimumStepsToMakePasswordStrong = (password) => {
    let lengthCheck = false
    let hasLowerCase = false
    let hasUpperCase = false
    let hasDigit = false
    let hasRepeatingChars = false
    // Check if the password meets the length requirement.
    if (password?.length > 6 && password?.length < 20) {
      lengthCheck = true
    }

    // Check if the password contains at least one lowercase letter, one uppercase letter, and one digit.
    for (let i = 0; i < password?.length; i++) {
      if (password[i] >= 'a' && password[i] <= 'z') {
        hasLowerCase = true
      }
      if (password[i] >= 'A' && password[i] <= 'Z') {
        hasUpperCase = true
      }
      if (password[i] >= '0' && password[i] <= '9') {
        hasDigit = true
      }
    }

    // Check if the password contains three repeating characters in a row.
    for (let i = 0; i < password?.length; i++) {
      if (
        i + 2 < password.length &&
        password[i] === password[i + 1] &&
        password[i + 1] === password[i + 2]
      ) {
        hasRepeatingChars = true
        break
      }
    }
    setValidation({
      ...validation,
      lengthCheck,
      hasLowerCase,
      hasUpperCase,
      hasDigit,
      hasRepeatingChars,
    })
  }

  const changehandler = (value) => {
    setInput(value)
    minimumStepsToMakePasswordStrong(value)
  }

  const createPassword = async () => {
    try {
      const response = await axios({
        method: 'post',
        url: `http://localhost:8080/password`,
        data: { password: input },
      })
      if (response) {
        alert('Password created Successfully')
        setInput('')
        setValidation({
          lengthCheck: false,
          hasLowerCase: false,
          hasUpperCase: false,
          hasDigit: false,
          hasRepeatingChars: false,
        })
        fetchAll()
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <React.Fragment>
      <div style={{ textAlign: 'center', marginTop: '10rem' }}>
        <label>Password: </label>
        <input value={input} onChange={(e) => changehandler(e.target.value)} />
        <button
          disabled={
            input?.length === 0
              ? true
              : input?.length &&
                (!validation.hasDigit ||
                  !validation.hasLowerCase ||
                  !validation.hasUpperCase ||
                  !validation.lengthCheck ||
                  validation.hasRepeatingChars)
          }
          onClick={createPassword}
        >
          Create
        </button>
      </div>
      <div style={{ textAlign: 'center' }}>
        {input?.length &&
        (!validation.hasDigit ||
          !validation.hasLowerCase ||
          !validation.hasUpperCase ||
          !validation.lengthCheck ||
          validation.hasRepeatingChars) ? (
          <p>Password is weak</p>
        ) : null}
      </div>
      <div style={{ marginTop: '5rem', textAlign: 'center' }}>
        <label>Password Table</label>
        {backendData?.map((dt, i) => (
          <div> {`${i + 1}: ${dt.password}`}</div>
        ))}
      </div>
    </React.Fragment>
  )
}
export default App
