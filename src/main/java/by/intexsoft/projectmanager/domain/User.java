package by.intexsoft.projectmanager.domain;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

import by.intexsoft.projectmanager.domain.enums.UserType;


@Entity
@Table (name="users")
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY )
	@Column(name = "user_id")
	@PrimaryKeyJoinColumn
	public Long id;
	
	@Column(nullable=false)
	public String email;
	
	@Column(nullable=false)
	public String password;
	
	@Column(nullable=false)
	public String name;
	
	@Column(nullable=false)
	public String lastName;
	
	@Column(nullable=false)
	@Enumerated(EnumType.STRING)
	public UserType type = UserType.NONE;
	
	@ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
	@JoinTable(name = "user_project", 
			joinColumns = { 
				@JoinColumn(name = "user_id", nullable = false) }, 
				inverseJoinColumns = { @JoinColumn(name = "project_id", nullable = false) })
	public List<Project> projects = new ArrayList<Project>();
	
	@ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
	@JoinTable(name = "user_iteration", 
			joinColumns = { 
				@JoinColumn(name = "user_id", nullable = false) }, 
				inverseJoinColumns = { @JoinColumn(name = "iteration_id", nullable = false) })
	public List<Iteration> iterations = new ArrayList<Iteration>();
	
	@ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
	@JoinTable(name = "user_task", 
			joinColumns = { 
				@JoinColumn(name = "user_id", nullable = false) }, 
				inverseJoinColumns = { @JoinColumn(name = "task_id", nullable = false) })
	public List<Task> tasks = new ArrayList<Task>();
	
	@ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
	@JoinTable(name = "user_checklist", 
			joinColumns = { 
				@JoinColumn(name = "user_id", nullable = false) }, 
				inverseJoinColumns = { @JoinColumn(name = "checklist_id", nullable = false) })
	public List<CheckList> checkLists = new ArrayList<CheckList>();
	
	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE})
    @JoinColumn(name="perm_settings_id")
	public PermissionsSettings permissionsSettings;

}
