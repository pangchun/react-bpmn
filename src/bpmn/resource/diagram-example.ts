const xml: string =
  '' +
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">\n' +
  '  <bpmn2:process id="Process_1" isExecutable="true">\n' +
  '    <bpmn2:extensionElements>\n' +
  '      <flowable:executionListener class="qwer" event="start" />\n' +
  '      <flowable:executionListener expression="123333" event="start" />\n' +
  '      <flowable:executionListener delegateExpression="123333" event="start" />\n' +
  '      <flowable:executionListener event="start">\n' +
  '        <flowable:script scriptFormat="111">222</flowable:script>\n' +
  '      </flowable:executionListener>\n' +
  '      <flowable:executionListener class="1" event="start">\n' +
  '        <flowable:field name="1">\n' +
  '          <flowable:string>1</flowable:string>\n' +
  '        </flowable:field>\n' +
  '        <flowable:field name="2">\n' +
  '          <flowable:expression>2</flowable:expression>\n' +
  '        </flowable:field>\n' +
  '      </flowable:executionListener>\n' +
  '    </bpmn2:extensionElements>\n' +
  '    <bpmn2:startEvent id="Event_0cvwr8a" name="开始请假流程">\n' +
  '      <bpmn2:outgoing>Flow_04cue2l</bpmn2:outgoing>\n' +
  '    </bpmn2:startEvent>\n' +
  '    <bpmn2:sequenceFlow id="Flow_04cue2l" sourceRef="Event_0cvwr8a" targetRef="Activity_01qnzb7" />\n' +
  '    <bpmn2:userTask id="Activity_01qnzb7" name="提交申请">\n' +
  '    <bpmn2:extensionElements>\n' +
  '      <flowable:executionListener class="qwer" event="start" />\n' +
  '      <flowable:executionListener expression="123333" event="start" />\n' +
  '      <flowable:executionListener delegateExpression="123333" event="start" />\n' +
  '      <flowable:executionListener event="start">\n' +
  '        <flowable:script scriptFormat="111">222</flowable:script>\n' +
  '      </flowable:executionListener>\n' +
  '      <flowable:executionListener class="1" event="start">\n' +
  '        <flowable:field name="1">\n' +
  '          <flowable:string>1</flowable:string>\n' +
  '        </flowable:field>\n' +
  '        <flowable:field name="2">\n' +
  '          <flowable:expression>2</flowable:expression>\n' +
  '        </flowable:field>\n' +
  '        </flowable:executionListener>\n' +
  '        <flowable:taskListener class="1" event="create" id="123">\n' +
  '          <flowable:field name="1">\n' +
  '            <flowable:string>1</flowable:string>\n' +
  '          </flowable:field>\n' +
  '        </flowable:taskListener>\n' +
  '    </bpmn2:extensionElements>\n' +
  '      <bpmn2:incoming>Flow_04cue2l</bpmn2:incoming>\n' +
  '      <bpmn2:outgoing>Flow_1w9obph</bpmn2:outgoing>\n' +
  '    </bpmn2:userTask>\n' +
  '    <bpmn2:exclusiveGateway id="Gateway_1vux1tc" name="申请是否通过">\n' +
  '      <bpmn2:incoming>Flow_1w9obph</bpmn2:incoming>\n' +
  '      <bpmn2:outgoing>Flow_1ltjq8e</bpmn2:outgoing>\n' +
  '      <bpmn2:outgoing>Flow_0kuen7a</bpmn2:outgoing>\n' +
  '    </bpmn2:exclusiveGateway>\n' +
  '    <bpmn2:sequenceFlow id="Flow_1w9obph" sourceRef="Activity_01qnzb7" targetRef="Gateway_1vux1tc" />\n' +
  '    <bpmn2:sequenceFlow id="Flow_1ltjq8e" sourceRef="Gateway_1vux1tc" targetRef="Activity_13j5o8i" />\n' +
  '    <bpmn2:userTask id="Activity_13j5o8i" name="审批通过">\n' +
  '      <bpmn2:incoming>Flow_1ltjq8e</bpmn2:incoming>\n' +
  '      <bpmn2:outgoing>Flow_0r0xnhe</bpmn2:outgoing>\n' +
  '    </bpmn2:userTask>\n' +
  '    <bpmn2:sequenceFlow id="Flow_0r0xnhe" sourceRef="Activity_13j5o8i" targetRef="Activity_04xfwa0" />\n' +
  '    <bpmn2:userTask id="Activity_04xfwa0" name="员工销假">\n' +
  '      <bpmn2:incoming>Flow_0r0xnhe</bpmn2:incoming>\n' +
  '      <bpmn2:outgoing>Flow_01n06d5</bpmn2:outgoing>\n' +
  '    </bpmn2:userTask>\n' +
  '    <bpmn2:sequenceFlow id="Flow_0kuen7a" sourceRef="Gateway_1vux1tc" targetRef="Activity_0jtkkd4" />\n' +
  '    <bpmn2:userTask id="Activity_0jtkkd4" name="审批不通过">\n' +
  '      <bpmn2:incoming>Flow_0kuen7a</bpmn2:incoming>\n' +
  '      <bpmn2:outgoing>Flow_1131euh</bpmn2:outgoing>\n' +
  '    </bpmn2:userTask>\n' +
  '    <bpmn2:sequenceFlow id="Flow_1131euh" sourceRef="Activity_0jtkkd4" targetRef="Activity_1ys9p77" />\n' +
  '    <bpmn2:sendTask id="Activity_1ys9p77" name="发送邮件通知员工">\n' +
  '      <bpmn2:incoming>Flow_1131euh</bpmn2:incoming>\n' +
  '      <bpmn2:outgoing>Flow_0gikf7m</bpmn2:outgoing>\n' +
  '    </bpmn2:sendTask>\n' +
  '    <bpmn2:sequenceFlow id="Flow_0gikf7m" sourceRef="Activity_1ys9p77" targetRef="Gateway_1af8bvn" />\n' +
  '    <bpmn2:parallelGateway id="Gateway_1af8bvn">\n' +
  '      <bpmn2:incoming>Flow_0gikf7m</bpmn2:incoming>\n' +
  '      <bpmn2:incoming>Flow_01n06d5</bpmn2:incoming>\n' +
  '      <bpmn2:outgoing>Flow_0d8zq2t</bpmn2:outgoing>\n' +
  '    </bpmn2:parallelGateway>\n' +
  '    <bpmn2:sequenceFlow id="Flow_01n06d5" sourceRef="Activity_04xfwa0" targetRef="Gateway_1af8bvn" />\n' +
  '    <bpmn2:intermediateThrowEvent id="Event_0ki06s5" name="请假流程结束">\n' +
  '      <bpmn2:incoming>Flow_0d8zq2t</bpmn2:incoming>\n' +
  '    </bpmn2:intermediateThrowEvent>\n' +
  '    <bpmn2:sequenceFlow id="Flow_0d8zq2t" sourceRef="Gateway_1af8bvn" targetRef="Event_0ki06s5" />\n' +
  '    <bpmn2:scriptTask id="Activity_0czjist" scriptFormat="1111" flowable:resultVariable="34444" flowable:resource="444" />\n' +
  '  </bpmn2:process>\n' +
  '  <bpmn2:message id="qwe" name="111qwr11" />\n' +
  '  <bpmn2:message id="qwerer" name="111" />\n' +
  '  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n' +
  '    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">\n' +
  '      <bpmndi:BPMNEdge id="Flow_04cue2l_di" bpmnElement="Flow_04cue2l">\n' +
  '        <di:waypoint x="278" y="240" />\n' +
  '        <di:waypoint x="330" y="240" />\n' +
  '      </bpmndi:BPMNEdge>\n' +
  '      <bpmndi:BPMNEdge id="Flow_1w9obph_di" bpmnElement="Flow_1w9obph">\n' +
  '        <di:waypoint x="430" y="240" />\n' +
  '        <di:waypoint x="485" y="240" />\n' +
  '      </bpmndi:BPMNEdge>\n' +
  '      <bpmndi:BPMNEdge id="Flow_1ltjq8e_di" bpmnElement="Flow_1ltjq8e">\n' +
  '        <di:waypoint x="535" y="240" />\n' +
  '        <di:waypoint x="590" y="240" />\n' +
  '      </bpmndi:BPMNEdge>\n' +
  '      <bpmndi:BPMNEdge id="Flow_0r0xnhe_di" bpmnElement="Flow_0r0xnhe">\n' +
  '        <di:waypoint x="690" y="240" />\n' +
  '        <di:waypoint x="750" y="240" />\n' +
  '      </bpmndi:BPMNEdge>\n' +
  '      <bpmndi:BPMNEdge id="Flow_0kuen7a_di" bpmnElement="Flow_0kuen7a">\n' +
  '        <di:waypoint x="510" y="265" />\n' +
  '        <di:waypoint x="510" y="350" />\n' +
  '        <di:waypoint x="590" y="350" />\n' +
  '      </bpmndi:BPMNEdge>\n' +
  '      <bpmndi:BPMNEdge id="Flow_1131euh_di" bpmnElement="Flow_1131euh">\n' +
  '        <di:waypoint x="690" y="350" />\n' +
  '        <di:waypoint x="750" y="350" />\n' +
  '      </bpmndi:BPMNEdge>\n' +
  '      <bpmndi:BPMNEdge id="Flow_0gikf7m_di" bpmnElement="Flow_0gikf7m">\n' +
  '        <di:waypoint x="850" y="350" />\n' +
  '        <di:waypoint x="915" y="350" />\n' +
  '      </bpmndi:BPMNEdge>\n' +
  '      <bpmndi:BPMNEdge id="Flow_01n06d5_di" bpmnElement="Flow_01n06d5">\n' +
  '        <di:waypoint x="850" y="240" />\n' +
  '        <di:waypoint x="940" y="240" />\n' +
  '        <di:waypoint x="940" y="325" />\n' +
  '      </bpmndi:BPMNEdge>\n' +
  '      <bpmndi:BPMNEdge id="Flow_0d8zq2t_di" bpmnElement="Flow_0d8zq2t">\n' +
  '        <di:waypoint x="965" y="350" />\n' +
  '        <di:waypoint x="1032" y="350" />\n' +
  '      </bpmndi:BPMNEdge>\n' +
  '      <bpmndi:BPMNShape id="Event_0cvwr8a_di" bpmnElement="Event_0cvwr8a">\n' +
  '        <dc:Bounds x="242" y="222" width="36" height="36" />\n' +
  '        <bpmndi:BPMNLabel>\n' +
  '          <dc:Bounds x="227" y="265" width="66" height="14" />\n' +
  '        </bpmndi:BPMNLabel>\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNShape id="Activity_1r8zo9h_di" bpmnElement="Activity_01qnzb7">\n' +
  '        <dc:Bounds x="330" y="200" width="100" height="80" />\n' +
  '        <bpmndi:BPMNLabel />\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNShape id="Gateway_1vux1tc_di" bpmnElement="Gateway_1vux1tc" isMarkerVisible="true">\n' +
  '        <dc:Bounds x="485" y="215" width="50" height="50" />\n' +
  '        <bpmndi:BPMNLabel>\n' +
  '          <dc:Bounds x="476" y="191" width="67" height="14" />\n' +
  '        </bpmndi:BPMNLabel>\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNShape id="Activity_0vtiook_di" bpmnElement="Activity_13j5o8i">\n' +
  '        <dc:Bounds x="590" y="200" width="100" height="80" />\n' +
  '        <bpmndi:BPMNLabel />\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNShape id="Activity_10xjie0_di" bpmnElement="Activity_04xfwa0">\n' +
  '        <dc:Bounds x="750" y="200" width="100" height="80" />\n' +
  '        <bpmndi:BPMNLabel />\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNShape id="Activity_02c212d_di" bpmnElement="Activity_0jtkkd4">\n' +
  '        <dc:Bounds x="590" y="310" width="100" height="80" />\n' +
  '        <bpmndi:BPMNLabel />\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNShape id="Activity_0vnpdxa_di" bpmnElement="Activity_1ys9p77">\n' +
  '        <dc:Bounds x="750" y="310" width="100" height="80" />\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNShape id="Gateway_03vzkq1_di" bpmnElement="Gateway_1af8bvn">\n' +
  '        <dc:Bounds x="915" y="325" width="50" height="50" />\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNShape id="Event_0ki06s5_di" bpmnElement="Event_0ki06s5">\n' +
  '        <dc:Bounds x="1032" y="332" width="36" height="36" />\n' +
  '        <bpmndi:BPMNLabel>\n' +
  '          <dc:Bounds x="1017" y="375" width="66" height="14" />\n' +
  '        </bpmndi:BPMNLabel>\n' +
  '      </bpmndi:BPMNShape>\n' +
  '    </bpmndi:BPMNPlane>\n' +
  '  </bpmndi:BPMNDiagram>\n' +
  '</bpmn2:definitions>\n';

/**
 * 初始化流程图示例 请假流程
 */
const diagramExample = {
  xml: xml,
};

export default diagramExample;
