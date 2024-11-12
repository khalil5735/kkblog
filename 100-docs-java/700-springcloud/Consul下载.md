[Consul Versions | HashiCorp Releases](https://releases.hashicorp.com/consul/)



输出版本号：

```powershell
consul --version
```

```powershell
E:\01-software-tool\02-devloptools\springcloud\consul\consul_1.17.3_windows_386>consul --version
Consul v1.17.3
Revision 009041f8
Build Date 2024-02-13T18:30:29Z
Protocol 2 spoken by default, understands 2 to 3 (agent will automatically use protocol >2 when speaking to compatible agents)
```



开启

```powershell
consul agent -dev
```



查看端口占用

netstat -nao|findstr 8300



taskkill /pid xx -f

