<template>
    <scroll class="listview" 
            :data="data" ref="listview" 
            :listenscroll = "listenscroll"
            :probeType="probeType"
            @scroll="scroll">
        <ul>
            <li v-for="group in data" class="list-group" ref="listGroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li v-for="item in group.items" class="list-group-item">
                        <img class="avatar" v-lazy="item.avatar">
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>

        <div class="list-shortcut" @touchstart.stop.prevent="onShortCutTouchStart" @touchmove.stop.prevent="onShortTouchMove">
            <ul>
                <li v-for="(item, index) in shortCutList" 
                    class="item" 
                    :class="{'current': currentIndex === index}"
                    :data-index="index">
                    {{item}}
                </li>
            </ul>
        </div>
    </scroll>
</template>

<script type="text/javascript">
import Scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom'

// 样式中定义
const ANCHOR_HEIGHT = 18

export default{
    created() {
        this.touch = {}
        this.listenscroll = true
        this.listHeight = []
        this.probeType = 3
    },
    data() {
        return {
            scrollY: -1,
            currentIndex: 0 // 高亮
        }
    },
    props: {
        data: {
            type: Array,
            default: []
        }
    },
    computed: {
        shortCutList() {
            return this.data.map((group) => {
                return group.title.substr(0, 1)
            })
        }
    },
    methods: {
        onShortCutTouchStart(e) {
            let anchorIndex = getData(e.target, 'index')
            // 获得触碰的手指，default第一个
            let firstTouch = e.touches[0]
            // 记录下当前touch的位置
            this.touch.y1 = firstTouch.pageY

            this.touch.anchorIndex = anchorIndex
            this._scrollTo(anchorIndex)
        },
        onShortTouchMove(e) {
            let firstTouch = e.touches[0]
            this.touch.y2 = firstTouch.pageY
            // 获取y轴上的偏移
            let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
            // 获取当前的index
            let anchorIndex = parseInt(this.touch.anchorIndex) + delta
            this._scrollTo(anchorIndex)
        },
        scroll(pos) {
            this.scrollY = pos.y
        },
        _scrollTo(index) {
            // 0 是动画效果
            this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
        },
        // 计算每个字母列表的高度
        _calculateHeight() {
            this.listHeight = []
            const list = this.$refs.listGroup
            let height = 0
            this.listHeight.push(height)
            for (let i = 0; i < list.length; i++) {
                let item = list[i]
                height += item.clientHeight
                this.listHeight.push(height)
            }
        }
    },
    watch: {
        data() {
            setTimeout(() => {
                this._calculateHeight()
            }, 20)
        },
        ScrollY(newY) {
            const listHeight = this.listHeight
            for (let i = 0; i < listHeight.length.length; i++) {
                let height1 = listHeight[i]
                let height2 = listHeight[i + 1]
                if (!height2 || (-newY > height1 && -newY < height2)) {
                    this.currentIndex = i
                    return
                }
            }
            this.currentIndex = 0
        }
    },
    components: {
        Scroll
    }
}
</script>

<style type="stylesheet" scoped lang="stylus">
@import "~common/stylus/variable"

.listview{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: $color-background;
    .list-group{
        padding-bottom: 30px;
        .list-group-title{
            height: 30px;
            line-height: 30px;
            padding-left: 20px;
            font-size: $font-size-small;
            color: $color-text-l;
            background: $color-highlight-background;
        }
        .list-group-item{
            display: flex;
            align-items: center;
            padding: 20px 0 0 30px;
            .avatar{
                width: 50px;
                height: 50px;
                border-radius: 50%;
            }
            .name{
                margin-left: 20px;
                color: $color-text-l;
                font-size: $font-size-medium;
            }
        }
    }
    .list-shortcut{
        position: absolute;
        z-index: 30;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        padding: 20px 0;
        border-radius: 10px;
        text-align: center;
        background: $color-background-d;
        font-family: Helvetica;
        .item{
            padding: 3px;
            line-height: 1;
            color: $color-text-l;
            font-size: $font-size-small;
            &.current{
                color: $color-theme
            }
        }
    }
    .list-fixed{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
    }
}
</style>