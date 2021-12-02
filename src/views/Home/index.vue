<template>
  <div style="margin: 20px 20px;">
    <Calendar @chosed="chosed">
      <template slot="day" slot-scope="date">
        <span v-if="!warningDay.includes(date.date.FullDay)">{{ date.date.Day }}</span>
        <span v-else>
          {{ date.date.Day }}
          <i class="warn"></i>
        </span>
      </template>
    </Calendar>
  </div>
</template>

<script>
import Calendar from '@/components/Calendar/index'
export default {
  components: {
    Calendar
  },
  data () {
    return {
      warningDay: [
        '2021-12-02'
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
