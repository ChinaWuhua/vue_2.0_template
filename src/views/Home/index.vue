<template>
  <div style="margin: 20px 20px;">
    <div class="date" style="max-width: 800px;">
      <CalendarMobile @chosed="chosed">
        <template slot="day" slot-scope="date">
          <span class="day" v-if="!warningDay.includes(date.date.FullDay)">{{ date.date.Day }}</span>
          <span class="day" v-else>
            {{ date.date.Day }}
            <i class="warn"></i>
          </span>
        </template>
      </CalendarMobile>
    </div>
  </div>
</template>

<script>
import CalendarMobile from '@/components/Calendar-Mobile/index'
export default {
  components: {
    CalendarMobile
  },
  data () {
    return {
      warningDay: [
        '2021-12-02', '2021-12-03', '2021-12-08'
      ]
    }
  },
  methods: {
    chosed (date) {
      console.log('已选日期: ', date)
    }
  }
}
</script>

<style lang="less" scoped>
  .warn {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 8px;
    background: #ff9900;
  }
</style>
