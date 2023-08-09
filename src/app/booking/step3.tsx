"use client"
import React, { useEffect } from "react"
import { Form, DatePicker, DatePickerProps } from "antd"

import CModal from "./Modal"

import type { FormInstance } from "antd"
import type { RangePickerProps } from "antd/es/date-picker"
import { AppDispatch, useAppSelector } from "@/redux/store"
import { useDispatch } from "react-redux"
import { saveData } from "@/redux/features/booking"
import "dayjs/locale/th"
import locale from "antd/es/date-picker/locale/th_TH"
import dayjs from "dayjs"

let dateSelected: any = []
let day = 0
let disableDates: any[] = []

type Props = {
  formRef: any
  form: FormInstance
}

export default function Step3({ formRef, form }: Props) {
  const booking = useAppSelector((state) => state.bookingReducer.value)
  const distpatch = useDispatch<AppDispatch>()

  let timeSlot = booking.cours

  if (timeSlot == 3 || timeSlot == 4) {
    day = 2
  } else if (timeSlot == 5 || timeSlot == 6) {
    day = 3
  }

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    const today = dayjs().startOf("day")
    // ปิดการใช้งานเดือนที่ 4 นับจากเดือนนี้
    const fourthMonthStart = today.add(3, "month").startOf("month")
    return current && (current < today || current > fourthMonthStart)
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
    // console.log(dateSelected)
  }

  function loopSuject() {
    let endTime = true // false in 3 5
    let disable1Day = true
    let element = []
    // เลือกคอร์ส 2 เท่านั่น
    if (timeSlot == 2) {
      return (
        <CModal
          form={form}
          dayString={dateSelected[0]}
          date={`date${0}`}
          disableCheckbox={true}
          disable1Day={false}
          index={0}
        />
      )
    } else if (timeSlot >= 3 && timeSlot <= 4) {
      //เลือกคอร์ส 3 - 4
      for (let i = 0; i < day; i++) {
        if (i + 2 == timeSlot) {
          endTime = false
          if (i + 3 == timeSlot) {
            disable1Day = false
          }
        }
        element.push(
          <CModal
            form={form}
            dayString={dateSelected[i]}
            date={`date${i}`}
            disableCheckbox={endTime}
            disable1Day={disable1Day}
            index={i}
            key={i}
          />
        )
      }
    } else if (timeSlot == 5) {
      //เลือกคอร์ส 5
      for (let i = 0; i < day; i++) {
        if (i + 3 == timeSlot) {
          endTime = false
          if (i + 4 == timeSlot) {
            disable1Day = false
          }
        }
        element.push(
          <CModal
            form={form}
            dayString={dateSelected[i]}
            date={`date${i}`}
            disableCheckbox={endTime}
            disable1Day={disable1Day}
            index={i}
            key={i}
          />
        )
      }
    } else if (timeSlot == 6) {
      //เลือกคอร์ส 6
      for (let i = 0; i < day; i++) {
        if (i + 4 == timeSlot) {
          disable1Day = false
        }
        element.push(
          <CModal
            form={form}
            dayString={dateSelected[i]}
            date={`date${i}`}
            disableCheckbox={endTime}
            disable1Day={disable1Day}
            index={i}
            key={i}
          />
        )
      }
    }
    return element
  }

  useEffect(() => {
    formRef.current?.resetFields(["dateSelect"])
    dateSelected = booking.dateSelect
  }, [])

  return (
    <>
      <div style={{ marginTop: "24px" }} />
      <h1 style={{ textAlign: "center" }}>เลือกคอร์ส</h1>
      <Form.Item
        name={"dateSelect"}
        label="เลือกวันที่"
        rules={[{ required: true, message: "โปรดเลือกวันที่" }]}
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 4 }}
        initialValue={
          booking.dateSelect[0] ? dayjs(booking.dateSelect[0]) : undefined
        }
      >
        <DatePicker
          locale={locale}
          onChange={changeDate}
          disabledDate={disabledDate}
        />
      </Form.Item>
      {booking.dateSelect[0] ? loopSuject() : ""}
    </>
  )
}
