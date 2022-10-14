<template>
  <div class="page_index">
<div v-title>共富帮</div>
    <div class="page_title">共富帮</div>
    <div class="page_info">
      <div class="introduce">
        <div class="introduce_box" v-for="item in intro" :key="item.id">
          <span>{{item.name}}</span>
          <div>{{item.content}}</div>
        </div>
      </div>
      <div class="content_box">
        <div class="info_box">
          <div class="info_box_title">核心指标
            <div class="jsc" @click="open()">驾驶舱</div>
          </div>
          <div class="target_box">
            <div class="target" v-for="item in target" :key="item.id" :style="{backgroundImage: 'url(' + item.bacimg + ')'}">
              <div class="target_content">{{item.title}}</div>
              <div class="target_content">{{item.content}}</div>
              <div class="target_content">
                <span class="target_number">{{item.num}}</span>
                <span class="target_unit">{{item.unit}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="info_box">
          <div class="info_box_title">流程再造</div>
          <img src="../../assets/portal_img/flowChart_portal.png" class="flow" style="margin-top: 20px">
        </div>
        <div class="info_box">
          <div class="info_box_title">业务协同</div>
          <div class="service_box">
            <div class="service_label">
              <div class="service" v-for=" item in service " :key=" item.id" :style="{backgroundImage: 'url(' + item.bacimg + ')'}">
                <div class="service_title">{{item.title}}</div>
                <div class="service_content">
                  <div class="service_obj"  v-for="i in item.content" :key="i">{{ i }}</div>
                </div>
              </div>
            </div>
            <div class="service_list">
              <div class="subsidy">
                <p>补贴金额汇总</p>
                <div class="subsidy_list">
                  <div class="table_title">
                    <p>政策补助名称</p>
                    <p>补贴农户</p>
                    <p>补贴总金额</p>
                  </div>
                  <div v-for="item in subsidy" :key="item.id">
                    <p>{{item.name}}</p>
                    <p>{{item.num}}</p>
                    <p>{{item.dollar}}</p>
                  </div>
                </div>
              </div>
              <div class="increase">
                <p>增收助达总计</p>
                <div class="increase_obj">
                  <div class="increase_content" v-for="item in increase" :key="item.id">
                    <div class="increase_left">
                      <img :src="item.img" alt="">
                      <span>{{item.title}}</span>
                    </div>
                    <div class="increase_right" >
                      <p>
                        <span>助达</span>
                        <span>{{item.family}}</span>
                        <span>户</span>
                      </p>
                      <p>
                        <span>助达</span>
                        <span>{{item.dollar}}</span>
                        <span>元</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="info_box">
          <div class="info_box_title">数据清单</div>
          <div class="list">
            <div class="list_box" v-for="item in listData" :key="item.id">
              <img :src="item.img">
              <div class="list_content">
                <span>{{item.list_name}}</span>
                <div class="num_box">
                  <span>调用次数：</span>
                  <span>{{item.list_num}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="info_box">
          <div class="timeline_box">
            <p class="info_box_title">工作体系</p>
            <div class="timeline_content" v-for="item in timeline" :key="item.id">
              <span>{{item.time}}</span>
              <div class="obj_content">
                <p>
                  <span>项目进度：</span>
                  <span>{{item.progress}}</span>
                </p>
                <p>
                  <span>项目内容：</span>
                  <span>{{item.content}}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="undotree_box">
            <p class="info_box_title">工作专班</p>
            <img src="../../assets/portal_img/undotree_portal.png" alt="">
          </div>
        </div>
        <div class="info_box">
          <div class="apply_box">
            <p class="info_box_title">应用成效</p>
            <div class="apply_content">
              <div class="tab">
                <div :class="activeIndex === 0 ? 'active' : 'unactive' " @click="activeIndex = 0,initCharts()">新增品牌入驻分布</div>
                <div :class="activeIndex === 1 ? 'active' : 'unactive' " @click="activeIndex = 1,initCharts2()">改革后农户收入</div>
              </div>
              <div class="echarts" ref="echarts">

              </div>
            </div>
          </div>
          <div class="policy_box">
            <p class="info_box_title">政策文件</p>
            <div class="policy_content">
              <div class="file_box" v-for="item in file" :key="item.id">
                <span>{{item.source}}</span>
                <p>
                  <span @click="dialogTableVisible = true; fileTitle = item.file_name; file_url = item.file_url">{{item.file_name}}</span>
                  <span>{{item.date}}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="info_box">
          <div class="info_box_title">三张清单</div>
          <div class="stree_box">
            <div class="stree_tab">
              <div :class="activeIndexStree === 1 ? 'stree_active' : 'stree_unactive' " @click="activeIndexStree = 1">重大需求</div>
              <div :class="activeIndexStree === 2 ? 'stree_active' : 'stree_unactive' " @click="activeIndexStree = 2">多跨场景</div>
              <div :class="activeIndexStree === 3 ? 'stree_active' : 'stree_unactive' " @click="activeIndexStree = 3">重大改革</div>
            </div>
            <div class="stree_content">
              <div class="need_box" v-if="activeIndexStree === 1">
                <div class="item">
                  <div>
                    需求名称
                  </div>
                  <div>
                    <p>聚焦帮扶共富小切口、撬动乡村振兴大牵引</p>
                  </div>
                </div>
                <div class="item">
                  <div>
                    需求类型
                  </div>
                  <div>
                    <p>群众关注的高频事项</p>
                  </div>
                </div>
                <div class="item">
                  <div>
                    需求内容
                  </div>
                  <div>
                    <p>今年，国家正式开启了共同富裕建设工作，并选择浙江省作为“共同富裕示范区”，要求通过多种途径着力构建农民持续较快增收的长效机制、拓宽农民增收渠道，先行探索共富模式。浙江省将文成县列入“浙江高质量发展建设共同富裕示范区”，当前我县农民增收存在主要问题：<br/>
                      ①群众端：政策不清晰、办理不便捷，帮扶精准度差；增收模式单一，增收途径稀少、增收能力不足，收入水平参差不齐。<br/>
                      ②政府端：信息不对称、数据不共享、帮扶不精准、资金不直达；解决“共同富裕”问题，实现共富管理可视化、实时化、在线化。<br/>
                      ③产业端：产业规模低、小、散，缺乏品牌化经营。</p>
                  </div>
                </div>
              </div>
              <div class="need_box" v-if="activeIndexStree === 2">
                <div class="item">
                  <div>
                    谋划基础
                  </div>
                  <div>
                    <p>文成县：小康码</p>
                  </div>
                </div>
                <div class="item">
                  <div>
                    项目类型
                  </div>
                  <div>
                    <p>增量开发</p>
                  </div>
                </div>
                <div class="item">
                  <div>
                    基本架构
                  </div>
                  <div>
                    <p>确保社会兜底保障、精准救助政策落地；丰富产业致富模式，推动农户与现代农业有效衔接，实现农村产业培育、群众增收，促进农民增收；聚焦全县收入水平最低群体，建立大户带动低收入农户和小农户的致富模式，践行”先富带后富“，不断缩小农户之间收入差距，推进全县农户共同富裕！<br/>
                      一、帮扶促共富。建立“一户一档”赋码管理机制和线上便捷申请机制，确保社会兜底保障、精准救助政策落地；农户在线了解、在线申报、在线审批、补贴发放一键查询；跨部门审批“一网通办”。 <br/>
                      二、产业促共富★：聚焦特定人群（农户），通过新型产业促增收机制和资源共享模式，将产业发展和农户的增收有效联结，提高农户的生产积极性和抗风险能力，实现资源的有效整合和高效利用，带动农户增收致富，壮大产业发展。<br/> 
                      （1）产业促共富模式：<br/>
                      1.保底增收（中蜂折股量化）为农户提供生产成本补助、技术培训服务及兜底收益；<br/>
                      2.二次分红（金丝皇菊）在分配劳动报酬基础上，开展二次分红；<br/>
                      3.抱团增收（飞地产业园）壮大村集体经济与农户增收模式，破解小个体无法参与大项目的问题；<br/>
                      4.产业联盟（黄年糕）为小农户提供产业标准化服务,并为产品销售提供兜底保障，实现产业孵化器功能。<br/>
                      （2）资源共享模式：  聚焦“转移性、经营性、工资性、财产性”四大收入模式，拓展农户收入渠道，有效提高农户收入水平。政府补贴在线办理，实时摸清转移财产；加快产品流转销售，带动经营增收；提供求职、招聘供需信息，促进就业增收；盘活闲置资源，实现资产变现。</p>
                  </div>
                </div>
                <div class="item">
                  <div>
                    小切口子场景
                  </div>
                  <div>
                    <p>产业促共富模式（二次分红、产业联盟、抱团增收、保底增收）。</p>
                  </div>
                </div>
              </div>
              <div class="need_box" v-if="activeIndexStree === 3">
                <div class="item">
                  <div>
                    改革项目
                  </div>
                  <div>
                    <p>实施万元农民收入新增工程</p>
                  </div>
                </div>
                <div class="item">
                  <div>
                    改革任务
                  </div>
                  <div>
                    <p>①体制机制创新：<br/>
                      1、“智慧化+网格化”服务机制，加强线上线下协同，“数字引领”服务，部门业务协同。建设帮扶共富的数据监测与可视化平台，制定群众帮扶数据指标，包括收入、补贴、劳动力、教育、就业等情况，以数字化形式进行集中展示，一图掌控帮扶全貌；设置各类分析专题，通过不同维度综合呈现帮扶工作进展状态；<br/>
                      2、创新建立了新型产业帮扶促增收机制<br/>
                      ②政策制度供给：<br/>
                      1、行政审批简化，补贴流程精“减”；<br/>
                      2、建设社会帮扶志愿者制度体系；<br/>
                      3、骗取涉残补贴奖励监管执法“一件事”。<br/>
                      ③业务流程重塑：<br/>
                      1、打造“共富帮”线上服务总入口，一体化为群众提供了解、申报、办理等服务；<br/>
                      2、建设帮扶共富管理平台，帮助政府部门开展监督管理、服务保障、及时响应、实时预警；<br/>
                      3、产业增收项目实现补贴发放一键查询、跨部门审批“一网通办”，做到申报流程数据跑、项目绩效一键察、财政补助资金一键达。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :title ='fileTitle' :visible.sync="dialogTableVisible">
      <iframe v-if="file_url" :src="'/pdfjs/pdf/viewer.html?file=' + file_url" frameborder="0" width="100%" style="height:800px;"></iframe>
    </el-dialog>
  </div>
</template>

<script>
  import * as echarts from 'echarts'

  export default {
    data() {
      return {
        fileTitle: '',
        file_url:'',
        activeIndex: 0,
        activeIndexStree: 1,
        echarts: null,
        dialogTableVisible: false,
        intro: [{
          name: "牵头单位：",
          content: "文成县农村农业局"
        }, {
          name: "协同单位：",
          content: "大数据中心、财政局、卫健局、市场监管局、民政局、住建局、医疗保障局、妇联、教育局、人社局、残联"
        }, {
          name: "场景简介：",
          content: "文成县“共富帮”是为提高低收入农户、小农户收入水平，聚焦“工资性收入、财产性收入、经营性收入、转移性收入”，围绕“产业促共富”“帮扶促共富”搭建的公共服务平台"
        }, {
          name: "服务对象：",
          content: "低收入农户、小户、大户"
        }],
        target: [
          {
            title: "帮扶低收入农户",
            content: "增加帮扶",
            num: 1221,
            unit: "户",
            bacimg:'https://img.hzanchu.com/acimg/f613956375a3f87e8ebeda9ad55d0d5f.png'
          },{
            title: "产业促富-保底增收",
            content: "增收",
            num: 240,
            unit: "元/年/户",
            bacimg:'https://img.hzanchu.com/acimg/1c969a554ccb11d533577021d7e97c87.png'
          },{
            title: "产业促富-抱团增收",
            content: "增收",
            num: 800,
            unit: "元/年/户",
            bacimg:'https://img.hzanchu.com/acimg/01ce679edb432c5848f03ef91537e31d.png'
          }
        ],
        service: [
          {
            bacimg: "https://img.hzanchu.com/acimg/73938428989bc5402fabbe9381d5790d.png",
            title: "跨部门",
            content: ["县农业局","县大数据局", "县卫健局","县市场监管局","县人社局","县医疗保障局","县民政局","县住建局","县财政局","县妇联","县教育局","县残联局"]
          },{
            bacimg: "https://img.hzanchu.com/acimg/2309c62df0c02598e048f0da2e8455f1.png",
            title: "跨层级",
            content: ["县、乡镇、村"]
          },{
            bacimg: "https://img.hzanchu.com/acimg/e6908fc852f774db359aac0d313520b3.png",
            title: "跨领域",
            content: ["暂无信息"]
          },{
            bacimg: "https://img.hzanchu.com/acimg/73938428989bc5402fabbe9381d5790d.png",
            title: "跨系统",
            content: ["数字社会","数字政府"]
          },{
            bacimg: "https://img.hzanchu.com/acimg/2e1d838dbac070f6c2aa3a1efe7a08b8.png",
            title: "跨业务",
            content: ["集成测土配方施肥","肥药两制","共享农机","农业保险","涉农补贴","农技服务"]
          }
        ],
        increase: [
          {
            img:"https://img.hzanchu.com/acimg/266a162badc8bee9a68a3de7c4d2e519.png",
            title: "保底增收",
            family: 4980,
            dollar: 38753.00
          },{
            img:"https://img.hzanchu.com/acimg/266a162badc8bee9a68a3de7c4d2e519.png",
            title: "抱团增收",
            family: 4980,
            dollar: 38753.00
          }
        ],
        subsidy: [
          {
            name: '特困补助',
            num: '400户',
            dollar: '20万'
          },{
            name: '低保补助',
            num: '260户',
            dollar: '60万'
          },{
            name: '教育补助',
            num: '840户',
            dollar: '80万'
          },{
            name: '医疗补助',
            num: '90户',
            dollar: '90万'
          }
        ],
        listData: [{
          id: 1,
          img: 'https://img.hzanchu.com/acimg/cd8ea6855740cb3b5102e30078cb637a.png',
          list_name: '低保户信息',
          list_num: '1834次'
        }, {
          id: 2,
          img: 'https://img.hzanchu.com/acimg/208dc1560231f971878aba9b38b91392.png',
          list_name: '低收入农户信息',
          list_num: '1930次'
        }, {
          id: 3,
          img: 'https://img.hzanchu.com/acimg/383e3089e60c2a9ef8301d4270bf359d.png',
          list_name: '残疾人信息',
          list_num: '556次'
        }, {
          id: 4,
          img: 'https://img.hzanchu.com/acimg/d81ccc6cee7e43000222b07d946596d0.png',
          list_name: '特困、低保、低收入信息',
          list_num: '657次'
        }, {
          id: 5,
          img: 'https://img.hzanchu.com/acimg/84c33c752df9d8f92215576bad177837.png',
          list_name: '已签约医生信息',
          list_num: '723次'
        }, {
          id: 6,
          img: 'https://img.hzanchu.com/acimg/dace279ef63bd9594ba08d42911d4848.png',
          list_name: '主体注册信息',
          list_num: '1826次'
        }, {
          id: 7,
          img: 'https://img.hzanchu.com/acimg/f6371d31fc4ef02c4b2610e832d25090.png',
          list_name: '电子合同签章信息',
          list_num: '1980次'
        }, {
          id: 8,
          img: 'https://img.hzanchu.com/acimg/5b7d560d806b0e6ad2f7fe2d4b9cea71.png',
          list_name: '扶贫资金发放信息',
          list_num: '5334次'
        }],
        timeline: [{
          id: 1,
          time: "2021年8月-2021年9月",
          progress: "推广运营阶段",
          content: "在各乡镇推广低收入农户、大户一起使用群众服务端产品，参与产业帮扶"
        }, {
          id: 2,
          time: "2021年6月-2021年8月",
          progress: "建设阶段",
          content: "跨部门跨层级数据打通、群众服务端建设、政府端建设"
        }, {
          id: 3,
          time: "2021年5月-2021年6月",
          progress: "谋划阶段",
          content: "三张清单确定，需求确认，政策制定"
        }],
        file: [{
          source: "文成县人民政府",
          file_name: "《关于印发文成县经济薄弱村和低收入农户抱团增收实施意见的通知》",
          date: "2021-06-10",
          file_url: "https://wencheng-xmgl-img.zjsszxc.com/acfile/%E5%85%B3%E4%BA%8E%E5%8D%B0%E5%8F%91%E6%96%87%E6%88%90%E5%8E%BF%E7%BB%8F%E6%B5%8E%E8%96%84%E5%BC%B1%E6%9D%91%E5%92%8C%E4%BD%8E%E6%94%B6%E5%85%A5%E5%86%9C%E6%88%B7%E6%8A%B1%E5%9B%A2%E5%A2%9E%E6%94%B6%E5%AE%9E%E6%96%BD%E6%84%8F%E8%A7%81%E7%9A%84%E9%80%9A%E7%9F%A5.pdf" 
        }, {
          source: "文成县科学技术局",
          file_name: "《文成县经济薄弱村和低收入农户抱团增收项目操作规程（试行）》",
          date: "2021-08-12",
          file_url: "https://wencheng-xmgl-img.zjsszxc.com/acfile/%E6%96%87%E6%88%90%E5%8E%BF%E7%BB%8F%E6%B5%8E%E8%96%84%E5%BC%B1%E6%9D%91%E5%92%8C%E4%BD%8E%E6%94%B6%E5%85%A5%E5%86%9C%E6%88%B7%E6%8A%B1%E5%9B%A2%E5%A2%9E%E6%94%B6%E9%A1%B9%E7%9B%AE%E6%93%8D%E4%BD%9C%E8%A7%84%E7%A8%8B%EF%BC%88%E8%AF%95%E8%A1%8C%EF%BC%89.pdf"
        }],
        applyDataLine: {
          dataX: ['大峃镇', '珊溪镇', '玉壶镇', '南田镇', '黄坦镇', '巨屿镇', '百丈漈镇', '西坑畲族镇', '峃口镇', '周山畲族乡'],
          dataY1: [830,1232,987,820,902,1023,1008,789,1390,540],
          dataY2: [34,32,39,39,39,39,35,34,30,39],
          unitY: "个",
          name: ['今年帮扶量', '环比增长率']
        },
        applyData: {
          dataX: ['大峃镇', '珊溪镇', '玉壶镇', '南田镇', '黄坦镇', '巨屿镇', '百丈漈镇', '西坑畲族镇', '峃口镇', '周山畲族乡'],
          dataY2: [830,1232,987,820,902,1023,1008,789,1390,540],
          dataY1: [980,1450,1340,920,1230,1340,1450,974,1640,890],
          unitY: "个",
          name: ['增加帮扶', '帮扶总数']
        }
      }
    },

    components: {},

    mounted() {
      this.initCharts();
      window.addEventListener('resize', () => {
        setTimeout(() => {
          this.activeIndex ? this.initCharts2() : this.initCharts();
          // this.initCharts();
        }, 1000)
      })
    },
    beforeDestroy() {
      window.removeEventListener('resize')
    },
    methods: {
      open () {
        // window.open('https://wencheng-sjdp.zjsszxc.com/shareScreen/eyJzY3JlZW5JZCI6ODB9')
        window.location.href = 'https://wencheng-sjdp.zjsszxc.com/shareScreen/eyJzY3JlZW5JZCI6ODB9';
      },
        initCharts() {
        if (this.echarts) {
          this.echarts.dispose()
          this.echarts = null
        }
        let option;
        option = {
          data: this.applyData.name,
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            right: '10%',
            top: 20,
            itemWidth: 10,
            itemHeight: 10,
          },
          xAxis: {
            type: 'category',
            data: this.applyData.dataX,
            name: this.applyData.unitX,
            axisLabel: {
              rotate: 50
            }
          },
          yAxis: {
            type: 'value',
            name: this.applyData.unitY
          },
          grid: {
            left: '4%',
            right: '4%',
            containLabel: true
          },
          series: [{
              name: this.applyData.name[0],
              data: this.applyData.dataY1,
              type: 'bar',
              barWidth: 10,
              smooth: true
            },
            {
              name: this.applyData.name[1],
              data: this.applyData.dataY2,
              type: 'bar',
              barWidth: 10,
              smooth: true
            }
          ],
          color: ['#F59725','#2C9CFC']
        }
        this.$nextTick(() => {
          this.echarts = echarts.init(this.$refs.echarts);
          option && this.echarts.setOption(option)
        })
      },
      initCharts2() {
        if (this.echarts) {
          this.echarts.dispose()
          this.echarts = null
        }
        let option;
        option = {
          data: this.applyDataLine.name,
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            right: '10%',
            top: 20,
            itemWidth: 10,
            itemHeight: 10,
          },
          xAxis: {
            type: 'category',
            data: this.applyDataLine.dataX,
            name: this.applyDataLine.unitX,
            axisLabel: {
              rotate: 50
            }
          },
          yAxis: [
            {
              type: 'value',
              name: this.applyDataLine.unitY
            },
            {
              type: 'value',
              name: '%',
              splitLine: {
                show: false
              }
            }
          ],
          grid: {
            left: '4%',
            right: '4%',
            containLabel: true
          },
          series: [{
              name: this.applyDataLine.name[0],
              data: this.applyDataLine.dataY1,
              type: 'bar',
              barWidth: 10,
              smooth: true
            },
            {
              name: this.applyDataLine.name[1],
              data: this.applyDataLine.dataY2,
              type: 'line',
              yAxisIndex: 1,
              smooth: true
            }
          ],
          color: ['#55C5D7','#FD9D4D']
        }
        this.$nextTick(() => {
          this.echarts = echarts.init(this.$refs.echarts);
          option && this.echarts.setOption(option)
        })
      },
      applyChange(e) {
        this.activeIndexStree = e;
        this.activeIndex = e;
      }
    }
  }
</script>

<style lang='scss' scoped>
  .page_index {
    width: 100%;
    background: linear-gradient(180deg, #2F9CFC 0%, #C7E1F8 100%);
    display: flex;
    flex-direction: column;
  }
  .page_title {
    font-size: 24px;
    color: #ffffff;
    font-weight: 600;
    text-align: center;
    height: 90px;
    padding: 33px 0px;
  }

  .page_info {
    display: flex;
    margin: 0px 20px 5% 20px;
    flex-direction: column;
    gap: 24px;

    .introduce{
      background: #ffffff;
      border-radius: 6px;
      padding: 16px 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .introduce_box {
        display: flex;
        font-size: 16px;
        line-height: 22px;

        &:nth-of-type(1),&:nth-of-type(2) {
          color: #1792FF;
          font-weight: 600;
        }

        div {
         flex: 1;
         width: 0;
        }

        span {
          display: block;
          width: 80px;
          font-weight: 600;
        }
      }
    }

  }

  .content_box {
    display: flex;
    gap: 24px;
    flex-direction: column;

    .info_box {
      background: #ffffff;
      border-radius: 6px;
      padding: 13px 16px;

      .info_box_title {
        font-weight: 600;
        font-size: 20px;
        color: #1792FF;
        height: 28px;
        position: relative;
        padding-left: 7px;

        &:after {
          content: ' ';
          position: absolute;
          height: 16px;
          top: 1px;
          left: 0px;
          width: 3px;
          background: #3D85FF;
          border-radius: 2px;
        }
      }

      &:nth-of-type(1) {
        .info_box_title {
          display: flex;
          justify-content: space-between;
          
          div {
            width: 10%;
            font-size: 16px;
            background: #ecf5ff;
            border: #b3d8ff;
            color: #409eff;
            border-radius: 10px;
            margin-right: 20px;
            text-align: center;
            padding: 5px;
            cursor: pointer;

            &:hover {
              color: #ffffff;
              background: #409eff;
            }
          }
        }
      }
    }
  }


  .target_box {
    display: flex;

    .target {
      height: 134px;
      object-fit: cover;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      flex: 1;

      &:nth-of-type(1) {
        background-image: url("../../assets/portal_img/target_1.png");
      }

      &:nth-of-type(2) {
        background-image: url("../../assets/portal_img/target_2.png");
      }

      &:nth-of-type(3) {
        background-image: url("../../assets/portal_img/target_3.png");
      }

      .target_content {
        text-align: center;
        line-height: 60px;
        height: 60px;
        color: #ffffff;
        font-size: 18px;
        font-weight: 600;

        &:nth-of-type(2),
        &:nth-of-type(3) {
          line-height: 30px;
          height: 30px;
          color: #333333;

          .target_number {
            color: rgba(28, 170, 252, 1);
            margin-right: 12px;
          }
        }
      }
    }
  }

  .flow {
    width: 100%;
    object-fit: contain;
    margin-top: 20px;
    height: 600px;
  }
  .service_box {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 24px;

    .service_label {
      display: flex;
      gap: 20px;

      .service {
        display: flex;
        flex: 1;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        height: 180px;

        .service_title {
          text-align: center;
          width: 22%;
          font-size: 18px;
          color: #ffffff;
          letter-spacing: 10px;
          writing-mode: vertical-lr;
          box-sizing: content-box;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center
        }

        .service_content {
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: center;
          padding: 14px;
          font-size: 14px;
          color: #333333;
          line-height: 16px;
          gap: 8px;
          flex-wrap: wrap;

          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;

          .service_obj {
            position: relative;
              &:before {
              content: ' ';
              position: absolute;
              width: 4px;
              height: 4px;
              background: #1892FC;
              top: 4px;
              left: -6px;
              border-radius: 50%;
              box-sizing: content-box;
            }
          }
        }
      }
    }

    .service_list {
      display: flex;
      
      .subsidy {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;

        > p {
          font-size: 18px;       
          color: #2C9CFC;
          font-weight: 600;
          line-height: 60px;
        }

        .subsidy_list{
          flex: 1;
          width: 84%;
          
          .table_title {
            color: #2C9CFC;
          }

          div {
            display: flex;
            line-height: 18px;
            padding: 16px 0px;
            font-size: 16px;
            text-align: center;
            color: #333333;
            
            &:nth-of-type(2n -1) {
              background: rgba(44, 156, 252, .1);
            }

            &:nth-of-type(2) {
              padding-top: 20px;
            }

            p {
              flex: 1;
            }
          }
        }
      }

      .increase {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;

        > p {
          font-size: 18px;       
          color: #2C9CFC;
          font-weight: 600;
          line-height: 60px;
        }

        .increase_obj {
          display: flex;
          flex-direction: column;
          gap: 53px;
          width: 84%;

          .increase_content {
            display: flex;
            flex: 1;
            background: rgba(44, 156, 252, .1);
            border-radius: 6px;
            padding: 18px;

            .increase_left {
              flex: 1;
              font-size: 16px;
              color: #333333;
              display: flex;
              gap: 24px;
              align-items: center;
              padding: 6px;

              img {
                width: 48px;
                height: 48px;
              }

              span {
                flex: 1;
              }
            }

            .increase_right {
              flex: 1;
              display: flex;
              flex-direction: column;
              gap: 10px;

              p {
                font-size: 16px;
                flex: 1;
                line-height: 30px;
                display: flex;

                span {
                  &:nth-of-type(2) {
                  font-weight: 600;  
                  color: #1CAAFC;
                  padding: 0px 10px 0px 17px;
                  }
                }
              }
            }
          }
        }

      }
    }
  }
  .list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 14px;

    .list_box {
      display: flex;
      width: 24%;
      margin: 0px 1% 20px 0px;
      border-radius: 5px;
      gap: 20px;
      padding: 12px 0px 14px 16px;
      align-items: center;

      &:nth-of-type(2n) {
        background: rgba(232, 113, 76, .2);

        span {
                  &:nth-of-type(2) {
                      color: #E8714C;
                      font-size: 18px;
                      font-weight: 600;
                    }
                }
      }

      &:nth-of-type(2n-1) {
        background: rgba(44, 156, 252, .2);

        span {
                  &:nth-of-type(2) {
                    color: #2C9CFC;
                    font-size: 18px;
                    font-weight: 600;
                  }
                }

      }

      img {
        width: 48px;
        height: 48px;

      }

      .list_content {
        // padding: 12px 0px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 13px;

        span:nth-of-type(1) {
          line-height: 22px;
          font-size: 16px;
          width: 180px;
          color: #333333;
        }

        .num_box {
          span {
            &:nth-of-type(1) {
              color: #666666;
            }

          }
        }
      }
    }
  }

   /* 工作体系、工作专班 info_box */
  .info_box:nth-last-of-type(3) {
    background: rgba(232, 113, 76, 0);
    display: flex;
    gap: 20px;
    padding: 0px;

    .timeline_box {
      background: #ffffff;
      border-radius: 6px;
      padding: 13px 16px;
      flex: 1;
      display: flex;
      flex-direction: column;
      width: 50%;

      .timeline_content {
        flex: 1;
        display: flex;
        flex-direction: column;
        font-size: 16px;
        color: #333333;
        padding-left: 12px;
        padding-top: 20px;
        position: relative;

        &:before {
          content: ' ';
          position: absolute;
          width: 4px;
          height: 4px;
          background: #1892FC;
          border: 2px solid rgba(24, 146, 252, .2);
          top: 26px;
          left: -4px;
          border-radius: 50%;
          box-sizing: content-box;
        }

        &:after {
          content: ' ';
          position: absolute;
          height: 100%;
          top: 26px;
          left: -0.5px;
          width: 1px;
          background: #1892FC;
        }

        &:nth-last-of-type(1) {
          &:after {
            height: calc(100% - 30px);
          }
        }

        >span {
          font-weight: 600;
          line-height: 22px;
        }

        .obj_content {
          font-weight: 400;
          padding: 0px 8px;
          background: rgba(250, 250, 250, 1);
          border-radius: 3px;
          margin: 10px 0px;
          line-height: 24px;

          p {
            &:first-child {
              padding: 10px 0px;
            }
          }
        }

      }
    }

    .undotree_box {
      background: #ffffff;
      border-radius: 6px;
      padding: 13px 16px;
      flex: 1;
      // width: 50%;

      img {
        width: 100%;
        object-fit: contain;
        margin-top: 20px;
      }
    }
  } 

  .info_box:nth-last-of-type(2) {
    background: rgba(232, 113, 76, 0);
    display: flex;
    gap: 20px;
    padding: 0px;

    .apply_box {
      background: #ffffff;
      border-radius: 6px;
      padding: 13px 16px;
      flex: 1;
      width: 50%;
      display: flex;
      flex-direction: column;

      .apply_content {
        display: flex;
        flex-direction: column;

        .tab {
          display: flex;
          align-content: center;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 600;
          line-height: 24px;
          justify-content: center;


          .active {
            background: rgba(44, 156, 252, 1);
            color: #ffffff;
            padding: 7px 54px;
          }

          .unactive {
            border: 1px solid #2C9CFC;
            color: #2C9CFC;
            padding: 7px 54px;
          }
        }

        .echarts {
          height: 300px;
        }
      }
    }

    .policy_box {
      background: #ffffff;
      border-radius: 6px;
      padding: 13px 16px;
      flex: 1;
      display: flex;
      flex-direction: column;

      .policy_content {
        display: flex;
        flex-direction: column;
        flex: 1;
        margin-top: 24px;

        .file_box {
          flex: 1;
          font-size: 16px;
          line-height: 20px;
          display: flex;
          flex-direction: column;


          >span {
            display: inline-block;
            width: 40%;
            color: #1892FC;
            padding: 7px 31px;
            background: rgba(44, 156, 252, .3);
            border-radius: 4px;
            text-align: center;
          }

          p {
            display: inline-block;
            color: #333333;
            margin-top: 12px;

            span {
              cursor: pointer;
              &:nth-of-type(2) {
                color: #666666;
                float: right;
              }
            }
          }
        }
      }
    }
  }

  /* 三张清单 */
  .stree_box {
    display: flex;
    flex-direction: column;
    gap: 26px;

    .stree_tab {
      display: flex;
      justify-content: center;
      font-size: 18px;
      line-height: 26px;
      border-radius: 4px;
      // font-weight: 500;

      .stree_active {
        background: rgba(44, 156, 252, 1);
        padding: 9px 55px;
        color: #ffffff;

      }

      .stree_unactive {
        border-top: 1px solid #2C9CFC;
        border-bottom: 1px solid #2C9CFC;
        border-left: 1px solid #2C9CFC;

        padding: 9px 55px;
        color: #2C9CFC;

        &:last-child {
          border-right: 1px solid #2C9CFC;
        }
      }

    }

    .stree_content {
      .need_box {
        border-top: 1px solid #CEE8FF;
        border-left: 1px solid #CEE8FF;
        font-size: 16px;

        .item {
          display: flex;

          div {
            display: flex;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #CEE8FF;
            border-right: 1px solid #CEE8FF;
            color: #333333;
            justify-content: center;

            p {
              line-height: 40px;
              padding: 24px;
            }

            &:nth-of-type(1) {
              width: 20%;
            }

            &:nth-of-type(2) {
              flex: 1;
            }
          }
        }
      }
    }
  }
  
</style>