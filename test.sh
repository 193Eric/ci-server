#!/bin/bash
souUser=root #服务端创建的用户名
souPwd=jianc@0817 #服务端创建的密码
souIP=119.23.147.29 #服务端ip address
souDir=/Users/ericli/Documents/xft-node-work/ideploy/temp/likai/23/dist #服务端的路径
desDir=/likai/dist #客户端的路径
auto_rsync () {
    expect -c "set timeout -1;
                spawn rsync -av --delete $4 $2@$3:$5;
                expect {
                    *assword:* {send -- $1\r;
                                 expect {'
                                    *denied* {exit 2;}
                                    eof
                                 }
                    }
                    eof         {exit 1;}
                }
                "
    return $?
}
auto_rsync $souPwd $souUser $souIP $souDir $desDir