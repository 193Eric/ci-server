#!/bin/bash
souUser=1 #服务端创建的用户名
souPwd=2 #服务端创建的密码
souIP=172.18.254.200 #服务端ip address
souDir=/data/www/ci-server/temp/likai/24/dist #服务端的路径
desDir=/data/www/91xft-xiangyasan-admin #客户端的路径
auto_rsync () {
    expect -c "set timeout -1;
                spawn rsync -av --delete $4 $3:$5;
                expect {
                    *assword:* {send -- \r;
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