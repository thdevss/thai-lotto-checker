# Thai Lotto Checker - API
เป็นการดึงข้อมูลรางวัลสลากกินแบ่งรัฐบาลจากเว็บไซต์ต้นทาง (sanook.com) เพื่อนำมาแสดงผลตามเงื่อนไขที่กำหนด

> โปรเจกต์นี้ทำเขียนเพื่อศึกษาการเขียนโปรแกรมด้วย Node.js และอื่น ๆ ที่เกี่ยวข้องเท่านั้น

## Tech Stack
- Node.js
- Express.js
- Axios
- Redis

## Example
> https://api-lotto.14devlab.co


## Endpoint

### Get all date

> GET /

แสดงรายการวันที่ในการตรวจสลากฯทั้งหมด

-----

### Get lotto result via date
> GET /:lottoDate

แสดงผลการออกสลากฯทั้งหมดตามวันที่กรอกเข้ามา
> Eg: https://api-lotto.14devlab.co/01062565

-------

### Check lotto result via date and lotto number
> GET /:lottoDate/:lottoNumber

ตรวจผลสลากฯตามวันที่และหมายเลขสลากที่ระบุ
> Eg: https://api-lotto.14devlab.co/01062565/333073