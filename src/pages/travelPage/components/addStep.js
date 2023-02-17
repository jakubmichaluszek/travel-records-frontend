import React, { useEffect, useState } from "react"
import styles from "./components.module.css"
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete"
import { GoogleMap, useLoadScript } from "@react-google-maps/api"
const libraries = ["places"]

export default function AddTravel(props) {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState()

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    libraries: libraries,
  })

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete()

  const handleImageChange = (event) => {
    setFile(event.target.files[0])
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const formData = new FormData()
    formData.append("file", file)

    const results = await getGeocode({ address: value })
    const position = await getLatLng(results[0])

    const details = {
      title: title,
      description: description,
      position: position,
      date: date,
      image: formData,
    }
    props.save(details, props.index)
    props.changeAdding()
  }

  return (
    <div className={styles.overlay}>
      <form className={styles.overlayInner} onSubmit={handleSubmit}>
        <label className={styles.textInAdding}>Step Details:</label>
        <input
          type="text-box"
          className={styles.destination}
          placeholder="Destination.."
          value={title}
          onChange={(e) => {
            e.target.value.length < 25 && setTitle(e.target.value)
          }}
        />
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          type="text"
          list="locations"
          className={styles.destination}
          placeholder="Location"
        />
        <datalist id="locations">
          {data?.map(({ place_id, description: desc }) => (
            <option
              key={place_id}
              value={desc}
              onClick={(e) => {
                console.log(e.target.value)
                setValue(e.target.value)
                clearSuggestions()
              }}
            >
              {desc}
            </option>
          ))}
        </datalist>
        <input
          type="date"
          className={styles.destination}
          placeholder="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value)
          }}
        />
        <textarea
          className={styles.description}
          placeholder="Description of the step.."
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
          }}
        ></textarea>
        <label className={styles.textCover}>Select photo:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <div className={styles.buttons}>
          <button
            className={styles.subimitBtn}
            onClick={() => {
              props.changeAdding()
            }}
          >
            Cancel
          </button>
          <input type="submit" value={"Save"} className={styles.subimitBtn} />
        </div>
      </form>
    </div>
  )
}
