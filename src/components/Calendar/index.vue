<template>
  <div class="Calendar">
    <div class="tools">
      <span class="button" @click="prevYear">上一年</span>
      <span class="button" @click="prevMonth">上月</span>
      <span class="tip">{{ Year }}-{{ Month > 9 ? Month : '0' + Month }}</span>
      <span class="button" @click="nextMonth">下月</span>
      <span class="button" @click="nextYear">下一年</span>
    </div>
    <ul>
      <li class="header" v-for="(item, index) in Header" :key="`header-${index}`">{{ item }}</li>
      <li v-for="(item, index) in begin" :key="`empty-${index}`"></li>
      <li v-for="(item, index) in Days" :key="`day-${index}`" @click="ClickDay({
        Year,
        Month: Month < 10 ? '0' + Month : Month,
        Day: index * 1 < 9 ? '0' + (index + 1) : index + 1,
        FullDay: `${Year}-${Month < 10 ? '0' + Month : Month}-${index * 1 < 9 ? '0' + (index + 1) : index + 1}`
      })">
        <template v-if="$scopedSlots.day">
          <slot name="day" :date="{
            Year,
            Month: Month < 10 ? '0' + Month : Month,
            Day: index * 1 < 9 ? '0' + (index + 1) : index + 1,
            FullDay: `${Year}-${Month < 10 ? '0' + Month : Month}-${index * 1 < 9 ? '0' + (index + 1) : index + 1}`
          }"></slot>
        </template>
        <template v-else>
          <span class="day">{{ index + 1 }}</span>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      begin: 0,
      Header: ['一', '二', '三', '四', '五', '六', '日'],
      DateObj: null,
      Year: 0,
      Month: 0,
      Days: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ClickDay (obj) {
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
      this.DateObj = dateStr ? new Date(dateStr) : new Date()
      this.Year = this.DateObj.getFullYear()
      this.Month = this.DateObj.getMonth() + 1
      const daysObj = new Date(this.Year, this.Month, 0)
      const count = daysObj.getDate()
      this.Days = new Array(count)
      const week = new Date(`${this.Year}-${this.Month}-01`)
      this.begin = week.getDay() - 1
    }
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>
