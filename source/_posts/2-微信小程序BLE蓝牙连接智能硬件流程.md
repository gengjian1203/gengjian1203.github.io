---
title: 2.微信小程序BLE蓝牙连接智能硬件流程
date: 2020-06-18 07:59:38
tags:
  - 微信小程序
categories:
  - projects
---

### BLE蓝牙连接智能硬件流程
微信小程序蓝牙模块只支持BLE，通常说的蓝牙4.0（及以上版本）。  
特点在于低功耗，高速率，距离短，数据量小，以字节流传输。  
  
可以通过手机下载对应APP应用来模拟被连接的硬件设备  
* iOS lightblue
* Android BLE调试宝
  
<!-- more -->

### 官方文档
[微信小程序蓝牙官方文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.startBluetoothDevicesDiscovery.html)

### 通讯流程
1. 初始化蓝牙适配器。
2. 搜索蓝牙设备获取设备UUID(deviceId)。（占用资源较多，不搜索要及时停止搜索）（另部分安卓机可能需要获取位置权限才能搜索到蓝牙设备）
3. 配对绑定设备，建立连接。
4. 通过设备UUID(deviceId)，获取该设备的设备所有服务(services)。
5. 通过设备UUID(deviceId)、服务UUID(serviceId)，获取蓝牙设备指定服务的所有特征值(characteristic)。
6. 通过特征值(characteristic)的属性，获取该特征值的读、写、广播权限。
7. 通过设备UUID(deviceId)、服务UUID(serviceId)、特征值UUID(characteristicId)，来对该特征值进行读写操作。（传输类型只支持ArrayBuffer）
8. 通过监听特征值的回调，获取特征值的变化情况。进而实现小程序蓝牙与智能硬件设备的通讯。
9. 由于BLE低功耗蓝牙的连接非常不稳定。比如：比如刚连接上就断开、连接成功之后传输数据随机断开等情况。所以要做好断线重连等底层通讯异常的对应处理。

### 参数示意图
![参数示意图](/images/image_2_1.jpg)


### 蓝牙常用API及返回值
1. 初始化蓝牙适配器  
wx.openBluetoothAdapter  
2. 开始搜寻附近的蓝牙外围设备    
wx.startBluetoothDevicesDiscovery  
3. 获取搜索发现到的蓝牙设备的具体信息      
wx.onBluetoothDeviceFound  
返回值：  
信号强度：RSSI: number,  
该设备启动服务的UUID：advertisServiceUUIDs: array,  
设备UUID：deviceId: string,  
设备名称：localName: string,  
设备名称：name: string,  
serviceData: array object  
4. 通过设备UUID(deviceId)，来连接对应的设备。  
wx.createBLEConnection  
若小程序在之前已有搜索过某个蓝牙设备，并成功建立连接，可直接传入之前搜索获取的 deviceId 直接尝试连接该设备，无需进行搜索操作。  
5. 通过设备UUID(deviceId)，获取指定蓝牙设备所有服务(service)  
wx.getBLEDeviceServices  
返回值：  
设备UUID：deviceId: string,  
开启的服务列表：service: array,    
6. 通过设备UUID(deviceId)和服务UUID(serviceId)，获取蓝牙设备指定服务的所有特征值(characteristic)。  
wx.getBLEDeviceCharacteristics  
返回值：  
设备UUID：deviceId: string,  
服务UUID：serviceId: string,  
特征值列表：characteristic: array object  
特征值UUID：characteristic[0].uuid  
该特征值是否支持read操作：characteristic[0].properties.read  
该特征值是否支持write操作：characteristic[0].properties.write  
该特征值是否支持notify操作：characteristic[0].properties.notify  
该特征值是否支持indicate操作：characteristic[0].properties.indicate  
7. 开启notify。必须先启用 notifyBLECharacteristicValueChange 接口才能接收到设备推送的 notification  
wx.notifyBLECharacteristicValueChange  
8. 监听低功耗蓝牙设备的特征值变化  
wx.onBLECharacteristicValueChange  
返回值：  
设备UUID：deviceId: string,  
服务UUID：serviceId: string,  
特征值UUID：characteristicId: string,  
特征值: value: ArrayBuffer,  
9. 发送数据到设备中  
wx.writeBLECharacteristicValue  
10. 关闭蓝牙模块。  
wx.closeBluetoothAdapter  
11. 停止搜寻附近的蓝牙外围设备。  
wx.stopBluetoothDevicesDiscovery  

### 附件
[基于Wepy的示例](/assets/assets_2_1.wpy)