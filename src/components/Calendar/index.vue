<template>
  <div class="Calendar">
    <div class="tools">
      <span class="button" @click="prevYear">上一年</span>
      <span class="button" @click="prevMonth">上月</span>
      <span class="tip">{{ Year }}-{{ Month > 9 ? Month : '0' + Month }}</span>
      <span class="button" @click="nextMonth">下月</span>
      <span class="button" @click="nextYear">下一年</span>
      <span class="button" @click="today">本月</span>
    </div>
    <ul>
      <!--头部-->
      <li class="header" v-for="(item, index) in Header" :key="`header-${index}`">{{ item }}</li>
      <!--头部空格补全-->
      <li v-for="(item, index) in begin" :key="`begin-${index}`" class="disabledDay">
        {{ item.Day }}
      </li>
      <!--日期-->
      <li v-for="(item, index) in Days" :key="`day-${index}`" :class="{chosed: index === chosed}" @click="ClickDay({
        Year,
        Month: Month < 10 ? '0' + Month : Month,
        Day: index * 1 < 9 ? '0' + (index + 1) : index + 1,
        FullDay: `${Year}-${Month < 10 ? '0' + Month : Month}-${index * 1 < 9 ? '0' + (index + 1) : index + 1}`
      }, index)">
        <template v-if="$scopedSlots.day">
          <slot name="day" :date="{
            Year,
            Month: Month < 10 ? '0' + Month : Month,
            Day: index * 1 < 9 ? '0' + (index + 1) : index + 1,
            FullDay: `${Year}-${Month < 10 ? '0' + Month : Month}-${index * 1 < 9 ? '0' + (index + 1) : index + 1}`
          }" />
        </template>
        <template v-else>
          <span class="day">{{ Day }}</span>
        </template>
      </li>
      <!--尾部空格补全-->
      <li v-for="(item, index) in end" :key="`end-${index}`" class="disabledDay">
        {{ item.Day }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      begin: [],
      end: [],
      Header: ['一', '二', '三', '四', '五', '六', '日'],
      DateObj: null,
      Year: 0,
      Month: 0,
      Days: [],
      chosed: -1
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    today () {
      this.init()
    },
    ClickDay (obj, index) {
      this.chosed = index
      this.$emit('chosed', obj)
    },
    nextYear () {
      this.Year += 1
      this.init(`${this.Year}-${this.Month}`)
    },
    nextMonth () {
      if (this.Month < 12) {
        this.Month += 1
      } else {
        this.Month = 1
        this.Year += 1
      }
      this.init(`${this.Year}-${this.Month}`)
    },
    prevMonth () {
      if (this.Month > 1) {
        this.Month -= 1
      } else {
        this.Month = 12
        this.Year -= 1
      }
      this.init(`${this.Year}-${this.Month}`)
    },
    prevYear () {
      this.Year -= 1
      this.init(`${this.Year}-${this.Month}`)
    },
    init (dateStr) {
      this.chosed = -1
      // 当月
      this.DateObj = dateStr ? new Date(dateStr) : new Date()
      this.Year = this.DateObj.getFullYear()
      this.Month = this.DateObj.getMonth() + 1
      const daysObj = new Date(this.Year, this.Month, 0)
      const count = daysObj.getDate()
      const Days = new Array(count)
      this.Days = Days.map((item, index) => ({
        Day: index + '1',
        Month: this.Month,
        Year: this.Year,
        count: count
      }))

      // 获取上月数据，补全头部空格
      const ifPrevYear = this.Month - 1 > 0
      const prevMonth = ifPrevYear ? this.Month - 1 : 12
      const prevYear = ifPrevYear ? this.Year : this.Year - 1
      const prevDaysObj = new Date(prevYear, prevMonth, 0)
      const prevCount = prevDaysObj.getDate()
      const prevArr = []
      for (let i = 0; i < prevCount; i++) {
        prevArr.push({
          Day: i + 1,
          Month: prevMonth,
          Year: prevYear,
          count: prevCount
        })
      }
      const startDay = new Date(`${this.Year}-${this.Month}-01`)
      let begin = startDay.getDay()
      if (begin === 0) begin = 7
      this.begin = prevArr.slice(prevArr.length - begin + 1)

      // 获取下月数据，补全尾部空格
      const ifNextYear = this.Month + 1 <= 12
      const nextMonth = ifNextYear ? this.Month + 1 : 1
      const nextYear = ifNextYear ? this.Year : this.Year + 1
      const nextDaysObj = new Date(nextYear, nextMonth, 0)
      const nextCount = nextDaysObj.getDate()
      const nextArr = []
      for (let i = 0; i < nextCount; i++) {
        nextArr.push({
          Day: i + 1,
          Month: nextMonth,
          Year: nextYear,
          count: nextCount
        })
      }
      const endDate = new Date(`${this.Year}-${this.Month}-${count}`)
      let endDay = endDate.getDay()
      if (endDay === 0) endDay = 7
      if (7 - endDay > 0) {
        const len = 7 - endDay
        this.end = nextArr.slice(0, len)
      } else {
        this.end = []
      }
    }
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>
