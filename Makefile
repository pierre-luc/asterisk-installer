prepare:
	mkdir -p asteriskBall/sources



asterisk-debian-6: prepare
	cd asteriskBall/sources
	wget http://downloads.asterisk.org/pub/telephony/asterisk/releases/asterisk-10.7.0.tar.gz -O asteriskBall/sources/asterisk-10.7.0.tar.gz
	tar xvzf asteriskBall/sources/asterisk-10.7.0.tar.gz
	mv asterisk-10.7.0 asteriskBall/sources
	./asteriskBall/sources/asterisk-10.7.0/configure
	make -C ./asteriskBall/sources/asterisk-10.7.0 menuselect
	make -C ./asteriskBall/sources/asterisk-10.7.0
	make -C ./asteriskBall/sources/asterisk-10.7.0 install
	make -C ./asteriskBall/sources/asterisk-10.7.0 samples
	make -C ./asteriskBall/sources/asterisk-10.7.0 config

clean:
	rm -rf asteriskBall