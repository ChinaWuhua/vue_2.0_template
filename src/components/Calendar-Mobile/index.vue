<template>
  <div
    class="Calendar-Mobile"
    @touchstart="touchstart"
    @touchmove="touchmove"
    @touchend="touchend"
  >
    <div class="tip">{{ Year }}-{{ Month > 9 ? Month : '0' + Month }}</div>
    <div class="header">
      <ul>
        <!--头部-->
        <li v-for="(item, index) in Header" :key="`header-${index}`">{{ item }}</li>
      </ul>
    </div>
    <div class="scroll-wrap" :class="{animate: moving === 0}" :style="{transform: `translateY(${moving + moved}px)`}">
      <ul>
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

    <div class="test">
      起始点: <span>{{ startX }}</span> - <span>{{ startY }}</span>
      <br />
      移动至: <span>{{ endX }}</span> - <span>{{ endY }}</span>
      <br />
      精确滑动: <span>{{ touchtime }}</span>
      <br />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 日历渲染
      begin: [],
      end: [],
      Header: ['一', '二', '三', '四', '五', '六', '日'],
      DateObj: null,
      Year: 0,
      Month: 0,
      Days: [],
      chosed: -1,

      // 触摸事件
      moved: 0,
      moving: 0,
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      touchtime: false,
      timeObj: null
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    // 触摸事件
    touchmove (e) {
      this.endX = e.changedTouches[0].pageX
      this.endY = e.changedTouches[0].pageY
      const distance = parseInt(this.endY - this.startY)
      this.moving = distance
    },
    touchend (e) {
      const num = this.moving > 0 ? 1 : -1
      const seek = this.moving % 60
      const diff = Math.abs(seek) > 30
      this.moved += this.moving
      this.moving = 0
      if (diff === true) {
        this.moved += (60 - Math.abs(seek)) * num
      } else {
        this.moved -= seek
      }
      clearTimeout(this.timeObj)
    },
    touchstart (e) {
      this.touchtime = false
      this.timeObj = setTimeout(() => {
        this.touchtime = true
      }, 400)
      this.startX = e.touches[0].pageX
      this.startY = e.touches[0].pageY
    },
    // 日历功能
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
