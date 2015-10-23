package com.shadow53.studentqueue;

import libs.In;
import libs.InvalidInputException;
import libs.Out;

public class App {

	public static void main(String[] args) {
		// Get student username
		String username = System.getProperty("user.name");
		
		// Set defaults to initialize
		boolean response = false;
		boolean needsHelp = true;
		
		// Loop through until valid input has been gotten
		do {
			try {
				needsHelp = In.GetBoolean(username + ", do you need help? [Yes/no]");
				response = true;
			} catch (InvalidInputException e) {
				// TODO Auto-generated catch block
				Out.Print("I didn't understand that. Please type \"yes\" or \"no\"");
				Out.NewLine();
			}
		} while (!response);
		
		// Check if the student wants help
		if (needsHelp) {
			Out.Print("Student needs help");
		}
		else {
			Out.Print("Student does not need help");
		}
		
		System.exit(0);
	}
// WEBSOCKETS http://www.oracle.com/technetwork/articles/java/jsr356-1937161.html
// OS: os.name
// USER HOME: user.home
// USER NAME: user.name

}
