"use client"
import React from "react"
import { Form, DatePicker, DatePickerProps } from "antd"

import CModal from "./Modal"

import "dayjs/locale/th"
import locale from "antd/es/date-picker/locale/th_TH"
import { AppDispatch, useAppSelector } from "@/redux/store"
import { useDispatch } from "react-redux"
import { saveData } from "@/redux/features/booking"

export default function Step3({ formRef, form }: any) {
  const booking = useAppSelector((state) => state.bookingReducer.value)
  const distpatch = useDispatch<AppDispatch>()

  let dateSelected = booking.dateSelect
  let timeSlot = booking.cours
  let day = 0
  let disableDates: any[] = []

  if (timeSlot == 3 || timeSlot == 4) {
    day = 2
  } else if (timeSlot == 5 || timeSlot == 6) {
    day = 3
  }

  const changeDate: DatePickerProps["onChange"] = (date, dateString) => {
    if (date) {
      dateSelected = []
      let cours = booking.cours
      if (cours < 3) cours = 1
      else if (cours < 5) cours = 2
      else if (cours < 7) cours = 3
      for (let i = 0; i < cours; i++) {
        const nextDate = date.clone().add(i, "days").format("YYYY-MM-DD")
        dateSelected.push(nextDate)
        if (disableDates.includes(nextDate)) {
          // setError("โปรดเลือกวันที่ที่ไม่ชนกับวันอื่น")
          formRef.current?.resetFields(["dateSelect"])
        }
      }
      distpatch(saveData({ dateSelect: dateSelected }))
    }
  }

  function loopSuject() {
    let endTime = true // false in 3 5
    let disable1Day = true
    let element = []
    // เลือกคอร์ส 2 เท่านั่น
    if (timeSlot == 2) {
      return (
        <CModal
          dayString={dateSelected[0]}
          date={`date${1}`}
          disableCheckbox={true}
          disable1Day={false}
          ckey={1}
        />
      )
    } else if (timeSlot >= 3 && timeSlot <= 4) {
      //เลือกคอร์ส 3 - 4
      console.log("คอรส์ " + timeSlot)
      for (let i = 0; i < day; i++) {
        if (i + 2 == timeSlot) {
          endTime = false
          if (i + 3 == timeSlot) {
            disable1Day = false
          }
        }
        element.push(
          <CModal
            dayString={dateSelected[i]}
            date={`date${i}`}
            disableCheckbox={endTime}
            disable1Day={disable1Day}
            ckey={i}
            key={i}
          />
        )
      }
    } else if (timeSlot == 5) {
      //เลือกคอร์ส 5
      console.log("คอรส์ " + timeSlot)
      for (let i = 0; i < day; i++) {
        if (i + 3 == timeSlot) {
          endTime = false
          if (i + 4 == timeSlot) {
            disable1Day = false
          }
        }
        element.push(
          <CModal
            dayString={dateSelected[i]}
            date={`date${i}`}
            disableCheckbox={endTime}
            disable1Day={disable1Day}
            ckey={i}
            key={i}
          />
        )
      }
    } else if (timeSlot == 6) {
      //เลือกคอร์ส 6
      console.log("คอรส์ " + timeSlot)
      for (let i = 0; i < day; i++) {
        if (i + 4 == timeSlot) {
          disable1Day = false
        }
        element.push(
          <CModal
            dayString={dateSelected[i]}
            date={`date${i}`}
            disableCheckbox={endTime}
            disable1Day={disable1Day}
            ckey={i}
            key={i}
          />
        )
      }
    }
    return element
  }

  return (
    <>
      <div style={{ marginTop: "24px" }} />
      <Form.Item
        name={"dateSelect"}
        label="เลือกวันที่"
        rules={[{ required: true, message: "โปรดเลือกวันที่" }]}
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 6 }}
      >
        <DatePicker locale={locale} onChange={changeDate} />
      </Form.Item>

      {booking.dateSelect.length != 0 && loopSuject()}
    </>
  )
}
