package io.ionic.starter;
import com.getcapacitor.community.database.sqlite.CapacitorSQLite;

import android.os.Bundle;

import com.capacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		// Initilizes the Bridge
		this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
			// Additional plugins you've installed go here
			add(CapacitorSQLite.class);
		}});
	}
}
